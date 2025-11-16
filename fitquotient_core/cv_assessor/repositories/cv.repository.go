package repositories

import (
	"context"
	"fmt"

	"cv_assessor/entities"
	svcErrors "cv_assessor/errors"
	"cv_assessor/infrastructure"
	"cv_assessor/utils"

	"github.com/qdrant/go-client/qdrant"
)

type CVRepository interface {
	UpsertCVVector(ctx context.Context, cv *entities.CvEntity, vector []float32) error
	GetCVVectorByID(ctx context.Context, cvID string) (*entities.CvEntity, error)
	DeleteCVVector(ctx context.Context, cvID string) error
	GetCVVector(ctx context.Context, cvID string) ([]float32, error)
}

type cvRepository struct {
	client *qdrant.Client
}

const CVCollectionName = "cvs"

func NewCVRepository() CVRepository {
	return &cvRepository{
		client: infrastructure.GetQdrantInstance().GetClient(),
	}
}

func (r *cvRepository) UpsertCVVector(ctx context.Context, cv *entities.CvEntity, vector []float32) error {
	if r.client == nil {
		return svcErrors.Internal("qdrant client is not initialized", fmt.Errorf("client is nil"))
	}

	if len(vector) == 0 {
		return svcErrors.InvalidInput("vector cannot be empty")
	}

	payload := qdrant.NewValueMap(map[string]interface{}{
		"cvId":      cv.CVId,
		"userId":    cv.UserId,
		"filename":  cv.Filename,
		"sourceUrl": cv.SourceUrl,
		"text":      cv.Text,
		"createdAt": cv.CreatedAt.String(),
		"updatedAt": cv.UpdatedAt.String(),
	})

	pointID := utils.StringToUint64(cv.CVId)
	point := &qdrant.PointStruct{
		Id:      &qdrant.PointId{PointIdOptions: &qdrant.PointId_Num{Num: pointID}},
		Vectors: &qdrant.Vectors{VectorsOptions: &qdrant.Vectors_Vector{Vector: &qdrant.Vector{Data: vector}}},
		Payload: payload,
	}

	_, err := r.client.Upsert(ctx, &qdrant.UpsertPoints{
		CollectionName: CVCollectionName,
		Points:         []*qdrant.PointStruct{point},
	})

	if err != nil {
		return svcErrors.Internal("failed to upsert cv vector to qdrant", err)
	}

	return nil
}

func (r *cvRepository) GetCVVectorByID(ctx context.Context, cvID string) (*entities.CvEntity, error) {
	if r.client == nil {
		return nil, svcErrors.Internal("qdrant client is not initialized", fmt.Errorf("client is nil"))
	}

	pointID := utils.StringToUint64(cvID)

	points, err := r.client.Get(ctx, &qdrant.GetPoints{
		CollectionName: CVCollectionName,
		Ids: []*qdrant.PointId{
			{PointIdOptions: &qdrant.PointId_Num{Num: pointID}},
		},
		WithPayload: &qdrant.WithPayloadSelector{SelectorOptions: &qdrant.WithPayloadSelector_Enable{Enable: true}},
		WithVectors: &qdrant.WithVectorsSelector{SelectorOptions: &qdrant.WithVectorsSelector_Enable{Enable: false}},
	})

	if err != nil {
		return nil, svcErrors.Internal("failed to get cv vector from qdrant", err)
	}

	if len(points) == 0 {
		return nil, svcErrors.NotFound("cv not found in qdrant")
	}

	point := points[0]
	cv := &entities.CvEntity{}

	if payload := point.Payload; payload != nil {
		if val, ok := payload["cvId"]; ok {
			cv.CVId = val.GetStringValue()
		}
		if val, ok := payload["userId"]; ok {
			cv.UserId = val.GetStringValue()
		}
		if val, ok := payload["filename"]; ok {
			cv.Filename = val.GetStringValue()
		}
		if val, ok := payload["sourceUrl"]; ok {
			cv.SourceUrl = val.GetStringValue()
		}
		if val, ok := payload["text"]; ok {
			cv.Text = val.GetStringValue()
		}
	}

	return cv, nil
}

func (r *cvRepository) DeleteCVVector(ctx context.Context, cvID string) error {
	if r.client == nil {
		return svcErrors.Internal("qdrant client is not initialized", fmt.Errorf("client is nil"))
	}

	pointID := utils.StringToUint64(cvID)

	condition := &qdrant.Condition{
		ConditionOneOf: &qdrant.Condition_HasId{
			HasId: &qdrant.HasIdCondition{
				HasId: []*qdrant.PointId{
					{PointIdOptions: &qdrant.PointId_Num{Num: pointID}},
				},
			},
		},
	}

	_, err := r.client.Delete(ctx, &qdrant.DeletePoints{
		CollectionName: CVCollectionName,
		Points: &qdrant.PointsSelector{
			PointsSelectorOneOf: &qdrant.PointsSelector_Filter{
				Filter: &qdrant.Filter{
					Must: []*qdrant.Condition{condition},
				},
			},
		},
	})

	if err != nil {
		return svcErrors.Internal("failed to delete cv vector from qdrant", err)
	}

	return nil
}

func (r *cvRepository) GetCVVector(ctx context.Context, cvID string) ([]float32, error) {
	if r.client == nil {
		return nil, svcErrors.Internal("qdrant client is not initialized", fmt.Errorf("client is nil"))
	}

	pointID := utils.StringToUint64(cvID)

	points, err := r.client.Get(ctx, &qdrant.GetPoints{
		CollectionName: CVCollectionName,
		Ids: []*qdrant.PointId{
			{PointIdOptions: &qdrant.PointId_Num{Num: pointID}},
		},
		WithPayload: &qdrant.WithPayloadSelector{SelectorOptions: &qdrant.WithPayloadSelector_Enable{Enable: false}},
		WithVectors: &qdrant.WithVectorsSelector{SelectorOptions: &qdrant.WithVectorsSelector_Enable{Enable: true}},
	})

	if err != nil {
		return nil, svcErrors.Internal("failed to get cv vector from qdrant", err)
	}

	if len(points) == 0 {
		return nil, svcErrors.NotFound("cv vector not found in qdrant")
	}

	point := points[0]
	if point.Vectors == nil {
		return nil, svcErrors.NotFound("vector data not found in qdrant")
	}

	if vec := point.Vectors.GetVector(); vec != nil {
		return vec.Data, nil
	}

	return nil, svcErrors.NotFound("vector data not found in qdrant")
}
