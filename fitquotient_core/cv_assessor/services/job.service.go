package services

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"cv_assessor/dtos/jobs"
	"cv_assessor/entities"
	svcErrors "cv_assessor/errors"
	infra "cv_assessor/infrastructure"
	"cv_assessor/repositories"
	"cv_assessor/utils"
)

type JobService interface {
	SaveJobWithChunks(ctx context.Context, job *entities.JobEntity, vector []float32) error
	GetJob(ctx context.Context, jobID string) (*entities.JobEntity, error)
	DeleteJob(ctx context.Context, jobID string) error
	CompareCVJob(ctx context.Context, cvID string, jobID string, apiKey string, model string, provider string) (string, error)
	GetComparisonResult(ctx context.Context, comparisonID string) (*jobs.ComparisonStatus, error)
}

type jobService struct {
	repo      repositories.JobRepository
	cvRepo    repositories.CVRepository
	llmClient *infra.LLMClient
}

func NewJobService(repo repositories.JobRepository) JobService {
	return &jobService{
		repo:      repo,
		cvRepo:    repositories.NewCVRepository(),
		llmClient: infra.NewLLMClient(),
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

func (s *jobService) CompareCVJob(ctx context.Context, cvID string, jobID string, apiKey string, model string, provider string) (string, error) {
	comparisonID := cvID + "-" + jobID
	cvVector, err := s.cvRepo.GetCVVector(ctx, cvID)
	if err != nil {
		return "", err
	}

	jobVector, err := s.repo.GetJobVector(ctx, jobID)
	if err != nil {
		return "", err
	}

	if len(cvVector) == 0 || len(jobVector) == 0 {
		return "", svcErrors.InvalidInput("vectors cannot be empty")
	}

	cv, err := s.cvRepo.GetCVVectorByID(ctx, cvID)
	if err != nil {
		return "", err
	}

	job, err := s.repo.GetJobVectorByID(ctx, jobID)
	if err != nil {
		return "", err
	}

	vectorComparison := utils.NewVectorComparison()
	similarity := vectorComparison.CosineSimilarity(cvVector, jobVector)
	query := s.buildComparisonPrompt(cv, job, similarity)

	llmReq := infra.LLMRequest{
		APIKey:   apiKey,
		Model:    model,
		Query:    query,
		Provider: infra.LLMProvider(provider),
	}

	s.saveProcessingStatusToRedis(comparisonID)
	go s.processAndSaveComparison(ctx, comparisonID, llmReq)

	return comparisonID, nil
}

func (s *jobService) GetComparisonResult(ctx context.Context, comparisonID string) (*jobs.ComparisonStatus, error) {
	result, err := infra.RedisClient.Get(ctx, "cv:match:"+comparisonID).Result()
	if err != nil {
		return nil, svcErrors.NotFound("comparison result not found")
	}

	var comparisonStatus jobs.ComparisonStatus
	err = json.Unmarshal([]byte(result), &comparisonStatus)
	if err != nil {
		utils.Log.Error("Failed to parse comparison status from Redis: " + err.Error())
		return nil, svcErrors.InvalidInput("failed to parse comparison result")
	}

	return &comparisonStatus, nil
}

func (s *jobService) buildComparisonPrompt(cv *entities.CvEntity, job *entities.JobEntity, similarity float32) string {
	prompt := fmt.Sprintf("You are an AI evaluator for a CV matching engine (ATS). Your job is to compare the candidate's CV with the Job Description.\n\n"+
		"Follow these rules:\n"+
		"- Use ONLY the information explicitly written in the CV and Job Description.\n"+
		"- Do NOT assume anything not stated.\n"+
		"- Be strict, concise, and accurate.\n"+
		"- Return ONLY valid JSON. No explanation outside JSON.\n\n"+
		"=====================\n"+
		"CV CONTENT:\n"+
		"%s\n"+
		"=====================\n\n"+
		"=====================\n"+
		"JOB DESCRIPTION:\n"+
		"%s\n"+
		"=====================\n\n"+
		"Vector similarity score (from vector database): %.4f\n\n"+
		"Your task:\n"+
		"Evaluate the candidate using the text above. Calculate a match score using this formula:\n\n"+
		"Scoring Weights:\n"+
		"- Skill Match Weight: 40%%\n"+
		"- Experience Relevance Weight: 30%%\n"+
		"- Missing Skills Penalty: 10%%\n"+
		"- Vector Similarity Weight: 20%%\n\n"+
		"Detailed Rules:\n"+
		"- skillMatch = list skills present in both CV and Job Description.\n"+
		"- missingSkills = list skills required in the job description but NOT found in the CV.\n"+
		"- experienceRelevance is a score (0-100) based on how well experience aligns with job duties.\n"+
		"- matchScore is a combined weighted score using the formula below:\n\n"+
		"matchScore = \n"+
		"  (skillMatchScore * 0.40) +\n"+
		"  (experienceRelevance * 0.30) +\n"+
		"  ((1 - missingSkillsPenalty) * 0.10 * 100) +\n"+
		"  (vectorSimilarity * 0.20 * 100)\n\n"+
		"Where:\n"+
		"- skillMatchScore = percentage of required skills found in CV.\n"+
		"- missingSkillsPenalty = missingSkillsCount / totalRequiredSkills.\n"+
		"- vectorSimilarity already between 0 and 1.\n\n"+
		"Return your analysis STRICTLY in this JSON format:\n\n"+
		"{\n"+
		"  \"matchScore\": number,\n"+
		"  \"vectorSimilarity\": number,\n"+
		"  \"skillMatch\": [\"string\"],\n"+
		"  \"missingSkills\": [\"string\"],\n"+
		"  \"experienceRelevance\": number,\n"+
		"  \"skillMatchScore\": number,\n"+
		"  \"missingSkillsPenalty\": number,\n"+
		"  \"summary\": \"short explanation\",\n"+
		"  \"recommendation\": \"Yes | Maybe | No\"\n"+
		"}\n\n"+
		"DO NOT return anything outside JSON.", cv.Text, job.Text, similarity)
	return prompt
}

func (s *jobService) saveProcessingStatusToRedis(comparisonID string) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	processingStatus := jobs.ComparisonStatus{
		Status: "processing",
		Result: nil,
	}

	statusJSON, err := json.Marshal(processingStatus)
	if err != nil {
		utils.Log.Error("Failed to marshal processing status: " + err.Error())
		return
	}

	err = infra.RedisClient.Set(ctx, "cv:match:"+comparisonID, string(statusJSON), 24*time.Hour).Err()
	if err != nil {
		utils.Log.Error("Failed to save processing status to Redis: " + err.Error())
		return
	}

	utils.Log.Info("Processing status saved to Redis for: " + comparisonID)
}

func (s *jobService) processAndSaveComparison(ctx context.Context, comparisonID string, llmReq infra.LLMRequest) {
	// Query LLM
	llmResp, err := s.llmClient.Query(ctx, llmReq)
	if err != nil {
		utils.Log.Error("LLM Query Error for " + comparisonID + ": " + err.Error())
		return
	}

	if llmResp.Error != "" {
		utils.Log.Error("LLM Query Error: " + llmResp.Error)
	}

	// Parse LLM response
	var matchResult jobs.MatchResult
	err = json.Unmarshal([]byte(llmResp.Content), &matchResult)
	if err != nil {
		utils.Log.Error("Failed to parse LLM response for " + comparisonID + ": " + err.Error())
		return
	}

	resultJSON, _ := json.MarshalIndent(matchResult, "", "  ")
	utils.Log.Info("Match Result for " + comparisonID + ": " + string(resultJSON))
	
	s.saveCompletedResultToRedis(comparisonID, matchResult)
}

func (s *jobService) saveCompletedResultToRedis(comparisonID string, matchResult jobs.MatchResult) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	completedStatus := jobs.ComparisonStatus{
		Status: "completed",
		Result: &matchResult,
	}

	statusJSON, err := json.Marshal(completedStatus)
	if err != nil {
		utils.Log.Error("Failed to marshal completed status: " + err.Error())
		return
	}

	err = infra.RedisClient.Set(ctx, "cv:match:"+comparisonID, string(statusJSON), 24*time.Hour).Err()
	if err != nil {
		utils.Log.Error("Failed to save completed result to Redis: " + err.Error())
		return
	}

	utils.Log.Info("Completed result saved to Redis for: " + comparisonID)
}
