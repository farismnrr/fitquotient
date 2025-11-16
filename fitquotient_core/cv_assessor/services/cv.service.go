package services

import (
	"context"

	"cv_assessor/entities"
	svcErrors "cv_assessor/errors"
	repositoriescvs "cv_assessor/repositories"
	"cv_assessor/utils"
)

type CVService interface {
	SaveCVWithChunks(ctx context.Context, cv *entities.CvEntity, vector []float32) error
	GetCV(ctx context.Context, cvID string) (*entities.CvEntity, error)
	DeleteCV(ctx context.Context, cvID string) error
}

type cvService struct {
	repo repositoriescvs.CVRepository
}

func NewCVService(repo repositoriescvs.CVRepository) CVService {
	return &cvService{
		repo: repo,
	}
}

func (s *cvService) SaveCVWithChunks(ctx context.Context, cv *entities.CvEntity, vector []float32) error {
	chunker := utils.NewTextChunker()
	chunks := chunker.ChunkText(cv.Text)
	if len(chunks) == 0 {
		return svcErrors.InvalidInput("text is empty after chunking")
	}

	cv.Text = chunks[0]
	err := s.repo.UpsertCVVector(ctx, cv, vector)
	if err != nil {
		return err
	}

	return nil
}

func (s *cvService) GetCV(ctx context.Context, cvID string) (*entities.CvEntity, error) {
	cv, err := s.repo.GetCVVectorByID(ctx, cvID)
	if err != nil {
		return nil, err
	}

	return cv, nil
}

func (s *cvService) DeleteCV(ctx context.Context, cvID string) error {
	err := s.repo.DeleteCVVector(ctx, cvID)
	if err != nil {
		return err
	}

	return nil
}
