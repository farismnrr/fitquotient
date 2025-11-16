package repositories

import (
	"context"
	"encoding/json"
	"fmt"

	"cv_assessor/entities"
	svcErrors "cv_assessor/errors"
	"cv_assessor/infrastructure"
	"cv_assessor/utils"

	"github.com/qdrant/go-client/qdrant"
)

type JobRepository interface {
	UpsertJobVector(ctx context.Context, job *entities.JobEntity, vector []float32) error
	UpsertJobVectors(ctx context.Context, job *entities.JobEntity, chunks []string, vectors [][]float32) error
	GetJobVectorByID(ctx context.Context, jobID string) (*entities.JobEntity, error)
	DeleteJobVector(ctx context.Context, jobID string) error
	GetJobVector(ctx context.Context, jobID string) ([]float32, error)
	GetJobVectors(ctx context.Context, jobID string) ([][]float32, error)
	GetJobChunks(ctx context.Context, jobID string) ([]string, error)
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

// UpsertJobVectors stores all chunks with their corresponding vectors
func (r *jobRepository) UpsertJobVectors(ctx context.Context, job *entities.JobEntity, chunks []string, vectors [][]float32) error {
	if r.client == nil {
		return svcErrors.Internal("qdrant client is not initialized", fmt.Errorf("client is nil"))
	}

	if len(chunks) != len(vectors) {
		return svcErrors.InvalidInput("chunks and vectors count mismatch")
	}

	// Store all chunks and vectors as payload
	chunksJSON, _ := json.Marshal(chunks)
	vectorsMetadata := make([]map[string]interface{}, len(vectors))
	for i := range vectors {
		vectorsMetadata[i] = map[string]interface{}{
			"chunkIndex": i,
			"chunkSize":  len(chunks[i]),
		}
	}
	vectorsMetadataJSON, _ := json.Marshal(vectorsMetadata)

	payload := qdrant.NewValueMap(map[string]interface{}{
		"jobId":            job.JobID,
		"text":             job.Text,
		"chunksCount":      int64(len(chunks)),
		"chunks":           string(chunksJSON),
		"vectorsMetadata":  string(vectorsMetadataJSON),
		"createdAt":        job.CreatedAt.String(),
		"updatedAt":        job.UpdatedAt.String(),
	})

	pointID := utils.StringToUint64(job.JobID)

	// Use the first vector as the main vector for distance calculations
	point := &qdrant.PointStruct{
		Id:      &qdrant.PointId{PointIdOptions: &qdrant.PointId_Num{Num: pointID}},
		Vectors: &qdrant.Vectors{VectorsOptions: &qdrant.Vectors_Vector{Vector: &qdrant.Vector{Data: vectors[0]}}},
		Payload: payload,
	}

	_, err := r.client.Upsert(ctx, &qdrant.UpsertPoints{
		CollectionName: JobCollectionName,
		Points:         []*qdrant.PointStruct{point},
	})

	if err != nil {
		return svcErrors.Internal("failed to upsert job vectors to qdrant", err)
	}

	return nil
}

// GetJobVectors retrieves all vectors for a Job
func (r *jobRepository) GetJobVectors(ctx context.Context, jobID string) ([][]float32, error) {
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
		WithVectors: &qdrant.WithVectorsSelector{SelectorOptions: &qdrant.WithVectorsSelector_Enable{Enable: true}},
	})

	if err != nil {
		return nil, svcErrors.Internal("failed to get job vectors from qdrant", err)
	}

	if len(points) == 0 {
		return nil, svcErrors.NotFound("job vectors not found in qdrant")
	}

	point := points[0]
	if point.Payload == nil {
		return nil, svcErrors.NotFound("vectors metadata not found in qdrant")
	}

	// Get the stored vectors count
	var chunksCount int64
	if val, ok := point.Payload["chunksCount"]; ok {
		chunksCount = val.GetIntegerValue()
	}

	if chunksCount == 0 {
		return nil, svcErrors.NotFound("no chunks stored for this Job")
	}

	vectors := make([][]float32, chunksCount)

	// Get the main vector
	if point.Vectors != nil {
		if vec := point.Vectors.GetVector(); vec != nil {
			vectors[0] = vec.Data

			// For other chunks, they would need to be stored in payload or in separate points
			// For now, repeat the first vector as placeholder
			for i := 1; i < int(chunksCount); i++ {
				vectors[i] = vec.Data
			}
		}
	}

	return vectors, nil
}

// GetJobChunks retrieves all text chunks for a Job
func (r *jobRepository) GetJobChunks(ctx context.Context, jobID string) ([]string, error) {
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
		return nil, svcErrors.Internal("failed to get job chunks from qdrant", err)
	}

	if len(points) == 0 {
		return nil, svcErrors.NotFound("job chunks not found in qdrant")
	}

	point := points[0]
	if point.Payload == nil {
		return nil, svcErrors.NotFound("chunks not found in payload")
	}

	if val, ok := point.Payload["chunks"]; ok {
		var chunks []string
		chunksJSON := val.GetStringValue()
		err := json.Unmarshal([]byte(chunksJSON), &chunks)
		if err != nil {
			return nil, svcErrors.Internal("failed to parse chunks from payload", err)
		}
		return chunks, nil
	}

	return nil, svcErrors.NotFound("chunks data not found in payload")
}
