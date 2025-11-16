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

type JobRepository interface {
	UpsertJobVector(ctx context.Context, job *entities.JobEntity, vector []float32) error
	GetJobVectorByID(ctx context.Context, jobID string) (*entities.JobEntity, error)
	DeleteJobVector(ctx context.Context, jobID string) error
	GetJobVector(ctx context.Context, jobID string) ([]float32, error)
}

type jobRepository struct {
	client *qdrant.Client
}

const JobCollectionName = "jobs"

func NewJobRepository() JobRepository {
	return &jobRepository{
		client: infrastructure.GetQdrantInstance().GetClient(),
	}
}

func (r *jobRepository) UpsertJobVector(ctx context.Context, job *entities.JobEntity, vector []float32) error {
	if r.client == nil {
		return svcErrors.Internal("qdrant client is not initialized", fmt.Errorf("client is nil"))
	}

	if len(vector) == 0 {
		return svcErrors.InvalidInput("vector cannot be empty")
	}

	payload := qdrant.NewValueMap(map[string]interface{}{
		"jobId":    job.JobID,
		"text":     job.Text,
		"createdAt": job.CreatedAt.String(),
		"updatedAt": job.UpdatedAt.String(),
	})

	pointID := utils.StringToUint64(job.JobID)
	point := &qdrant.PointStruct{
		Id:      &qdrant.PointId{PointIdOptions: &qdrant.PointId_Num{Num: pointID}},
		Vectors: &qdrant.Vectors{VectorsOptions: &qdrant.Vectors_Vector{Vector: &qdrant.Vector{Data: vector}}},
		Payload: payload,
	}

	_, err := r.client.Upsert(ctx, &qdrant.UpsertPoints{
		CollectionName: JobCollectionName,
		Points:         []*qdrant.PointStruct{point},
	})

	if err != nil {
		return svcErrors.Internal("failed to upsert job vector to qdrant", err)
	}

	return nil
}

func (r *jobRepository) GetJobVectorByID(ctx context.Context, jobID string) (*entities.JobEntity, error) {
	if r.client == nil {
		return nil, svcErrors.Internal("qdrant client is not initialized", fmt.Errorf("client is nil"))
	}

	pointID := utils.StringToUint64(jobID)

	points, err := r.client.Get(ctx, &qdrant.GetPoints{
		CollectionName: JobCollectionName,
		Ids: []*qdrant.PointId{
			{PointIdOptions: &qdrant.PointId_Num{Num: pointID}},
		},
		WithPayload: &qdrant.WithPayloadSelector{SelectorOptions: &qdrant.WithPayloadSelector_Enable{Enable: true}},
		WithVectors: &qdrant.WithVectorsSelector{SelectorOptions: &qdrant.WithVectorsSelector_Enable{Enable: false}},
	})

	if err != nil {
		return nil, svcErrors.Internal("failed to get job vector from qdrant", err)
	}

	if len(points) == 0 {
		return nil, svcErrors.NotFound("job not found in qdrant")
	}

	point := points[0]
	job := &entities.JobEntity{}

	if payload := point.Payload; payload != nil {
		if val, ok := payload["jobId"]; ok {
			job.JobID = val.GetStringValue()
		}
		if val, ok := payload["text"]; ok {
			job.Text = val.GetStringValue()
		}
	}

	return job, nil
}

func (r *jobRepository) DeleteJobVector(ctx context.Context, jobID string) error {
	if r.client == nil {
		return svcErrors.Internal("qdrant client is not initialized", fmt.Errorf("client is nil"))
	}

	pointID := utils.StringToUint64(jobID)

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
		CollectionName: JobCollectionName,
		Points: &qdrant.PointsSelector{
			PointsSelectorOneOf: &qdrant.PointsSelector_Filter{
				Filter: &qdrant.Filter{
					Must: []*qdrant.Condition{condition},
				},
			},
		},
	})

	if err != nil {
		return svcErrors.Internal("failed to delete job vector from qdrant", err)
	}

	return nil
}

func (r *jobRepository) GetJobVector(ctx context.Context, jobID string) ([]float32, error) {
	if r.client == nil {
		return nil, svcErrors.Internal("qdrant client is not initialized", fmt.Errorf("client is nil"))
	}

	pointID := utils.StringToUint64(jobID)

	points, err := r.client.Get(ctx, &qdrant.GetPoints{
		CollectionName: JobCollectionName,
		Ids: []*qdrant.PointId{
			{PointIdOptions: &qdrant.PointId_Num{Num: pointID}},
		},
		WithPayload: &qdrant.WithPayloadSelector{SelectorOptions: &qdrant.WithPayloadSelector_Enable{Enable: false}},
		WithVectors: &qdrant.WithVectorsSelector{SelectorOptions: &qdrant.WithVectorsSelector_Enable{Enable: true}},
	})

	if err != nil {
		return nil, svcErrors.Internal("failed to get job vector from qdrant", err)
	}

	if len(points) == 0 {
		return nil, svcErrors.NotFound("job vector not found in qdrant")
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
