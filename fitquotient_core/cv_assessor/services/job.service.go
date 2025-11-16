package services

import (
	"context"

	"cv_assessor/entities"
	svcErrors "cv_assessor/errors"
	"cv_assessor/repositories"
	"cv_assessor/utils"
)

type JobService interface {
	SaveJobWithChunks(ctx context.Context, job *entities.JobEntity, vector []float32) error
	GetJob(ctx context.Context, jobID string) (*entities.JobEntity, error)
	DeleteJob(ctx context.Context, jobID string) error
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

func (s *jobService) SaveJobWithChunks(ctx context.Context, job *entities.JobEntity, vector []float32) error {
	chunker := utils.NewTextChunker()
	chunks := chunker.ChunkText(job.Text)
	if len(chunks) == 0 {
		return svcErrors.InvalidInput("text is empty after chunking")
	}

	job.Text = chunks[0]
	err := s.repo.UpsertJobVector(ctx, job, vector)
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

func (s *jobService) DeleteJob(ctx context.Context, jobID string) error {
	err := s.repo.DeleteJobVector(ctx, jobID)
	if err != nil {
		return err
	}

	return nil
}
