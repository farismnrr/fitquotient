package services

import (
	"context"

	"cv_assessor/entities"
	svcErrors "cv_assessor/errors"
	"cv_assessor/repositories"
	"cv_assessor/utils"
)

type JobService interface {
	SaveJobWithChunks(ctx context.Context, job *entities.JobEntity, vectors [][]float32) error
	GetJob(ctx context.Context, jobID string) (*entities.JobEntity, error)
	DeleteJob(ctx context.Context, jobID string) error
	GetJobChunks(ctx context.Context, jobID string) ([]string, error)
}

type jobService struct {
	repo   repositories.JobRepository
	cvRepo repositories.CVRepository
}

func NewJobService(repo repositories.JobRepository) JobService {
	return &jobService{
		repo:   repo,
		cvRepo: repositories.NewCVRepository(),
	}
}

func (s *jobService) SaveJobWithChunks(ctx context.Context, job *entities.JobEntity, vectors [][]float32) error {
	chunker := utils.NewTextChunker()
	chunks := chunker.ChunkText(job.Text)
	if len(chunks) == 0 {
		return svcErrors.InvalidInput("text is empty after chunking")
	}

	// Validate that vectors count matches chunks count
	if len(vectors) != len(chunks) {
		return svcErrors.InvalidInput("vectors count must match chunks count")
	}

	// Validate all vectors are not empty
	for i, vec := range vectors {
		if len(vec) == 0 {
			return svcErrors.InvalidInput("vector at index " + string(rune(i)) + " is empty")
		}
	}

	// Store all chunks with vectors
	err := s.repo.UpsertJobVectors(ctx, job, chunks, vectors)
	if err != nil {
		return err
	}

	return nil
}

func (s *jobService) GetJob(ctx context.Context, jobID string) (*entities.JobEntity, error) {
	job, err := s.repo.GetJobVectorByID(ctx, jobID)
	if err != nil {
		return nil, err
	}

	return job, nil
}

func (s *jobService) GetJobChunks(ctx context.Context, jobID string) ([]string, error) {
	chunks, err := s.repo.GetJobChunks(ctx, jobID)
	if err != nil {
		return nil, err
	}

	return chunks, nil
}

func (s *jobService) DeleteJob(ctx context.Context, jobID string) error {
	err := s.repo.DeleteJobVector(ctx, jobID)
	if err != nil {
		return err
	}

	return nil
}
