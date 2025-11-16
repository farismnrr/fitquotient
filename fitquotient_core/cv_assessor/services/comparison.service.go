package services

import (
	"context"
	"encoding/json"
	"fmt"
	"regexp"
	"strings"
	"time"

	"cv_assessor/dtos/jobs"
	svcErrors "cv_assessor/errors"
	infra "cv_assessor/infrastructure"
	"cv_assessor/repositories"
	"cv_assessor/utils"
)

type ComparisonService interface {
	CompareCVJob(ctx context.Context, cvID string, jobID string, apiKey string, model string, provider string) (string, error)
	GetComparisonResult(ctx context.Context, comparisonID string) (*jobs.ComparisonStatus, error)
}

type comparisonService struct {
	cvRepo    repositories.CVRepository
	jobRepo   repositories.JobRepository
	llmClient *infra.LLMClient
}

func NewComparisonService() ComparisonService {
	return &comparisonService{
		cvRepo:    repositories.NewCVRepository(),
		jobRepo:   repositories.NewJobRepository(),
		llmClient: infra.NewLLMClient(),
	}
}

/* ============================================================
   PREPROCESSING HELPERS
   ============================================================ */

func normalizeText(input string) string {
	input = strings.ToLower(input)
	input = regexp.MustCompile(`\s+`).ReplaceAllString(input, " ")
	input = strings.TrimSpace(input)
	return input
}

func extractSkills(text string) []string {
	commonSkills := []string{
		"go", "golang", "python", "javascript", "typescript",
		"react", "node", "java", "php", "c++", "rust",
		"kubernetes", "docker", "aws", "gcp", "azure",
		"distributed systems", "microservices",
		"sql", "postgres", "mysql", "nosql", "mongodb",
		"communication", "leadership", "mentoring", "teamwork",
	}

	found := []string{}
	text = strings.ToLower(text)

	for _, skill := range commonSkills {
		if strings.Contains(text, skill) {
			found = append(found, skill)
		}
	}
	return found
}

func shortSummary(text string) string {
	if len(text) <= 700 {
		return text
	}
	return text[:700] 
}

/* ============================================================
   MAIN COMPARISON
   ============================================================ */

func (s *comparisonService) CompareCVJob(ctx context.Context, cvID string, jobID string, apiKey string, model string, provider string) (string, error) {
	comparisonID := cvID + "-" + jobID

	// Get all vectors for CV and Job
	cvVectors, err := s.cvRepo.GetCVVectors(ctx, cvID)
	if err != nil {
		return "", err
	}

	jobVectors, err := s.jobRepo.GetJobVectors(ctx, jobID)
	if err != nil {
		return "", err
	}

	if len(cvVectors) == 0 || len(jobVectors) == 0 {
		return "", svcErrors.InvalidInput("vectors cannot be empty")
	}

	// Get raw text (chunks)
	cvChunks, err := s.cvRepo.GetCVChunks(ctx, cvID)
	if err != nil {
		return "", err
	}

	jobChunks, err := s.jobRepo.GetJobChunks(ctx, jobID)
	if err != nil {
		return "", err
	}

	// Compute average similarity across all chunks
	vectorComparison := utils.NewVectorComparison()
	similarity := vectorComparison.AverageCosineSimilarity(cvVectors, jobVectors)

	// Fallback supaya tidak 0 (LLM sensitivity issue)
	if similarity == 0 {
		similarity = 0.12
	}

	// Build prompt using all chunks
	query := s.buildComparisonPromptFromChunks(cvChunks, jobChunks, similarity)

	// Prepare LLM request
	llmReq := infra.LLMRequest{
		APIKey:   apiKey,
		Model:    model,
		Query:    query,
		Provider: infra.LLMProvider(provider),
	}

	s.saveProcessingStatusToRedis(comparisonID)

	bgCtx, cancel := context.WithTimeout(context.Background(), 6*time.Minute)
	go func() {
		defer cancel()
		s.processAndSaveComparison(bgCtx, comparisonID, llmReq)
	}()

	return comparisonID, nil
}

func (s *comparisonService) GetComparisonResult(ctx context.Context, comparisonID string) (*jobs.ComparisonStatus, error) {
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

/* ============================================================
   PROMPT GENERATOR 
   ============================================================ */



// buildComparisonPromptFromChunks builds a comparison prompt from all chunks
func (s *comparisonService) buildComparisonPromptFromChunks(cvChunks []string, jobChunks []string, similarity float32) string {
	// Combine and normalize all chunks
	cvText := strings.Join(cvChunks, "\n\n")
	jobText := strings.Join(jobChunks, "\n\n")

	cvNorm := normalizeText(cvText)
	jobNorm := normalizeText(jobText)

	cvSkills := extractSkills(cvNorm)
	jdSkills := extractSkills(jobNorm)

	prompt := fmt.Sprintf(`
You are an AI evaluator for an ATS system.
You must compare a CV and a Job Description strictly based on the text provided.

=====================
CV SUMMARY:
%s
=====================

=====================
JOB SUMMARY:
%s
=====================

Detected Skills:
- CV Skills: %v
- JD Skills: %v

Vector Similarity (Average across all chunks): %.4f

RULES:
- Use ONLY the provided text.
- NO assumptions.
- Be strict and literal.
- All numeric outputs MUST follow the boundaries described below.

DEFINITIONS:
- skillMatchScore = percentage (0-100)
- missingSkillsPenalty = ratio between 0 and 1 
  Example: if JD has 5 skills and CV misses 3 → penalty = 3/5 = 0.6

JSON FORMAT (return EXACTLY this):
{
  "matchScore": number,
  "vectorSimilarity": number,
  "skillMatch": ["string"],
  "missingSkills": ["string"],
  "experienceRelevance": number,
  "skillMatchScore": number between 0 and 100,
  "missingSkillsPenalty": number between 0 and 1,
  "summary": "short explanation",
  "recommendation": "Yes | Maybe | No"
}

Return ONLY pure JSON. No markdown, no backticks.
`,
		shortSummary(cvNorm),
		shortSummary(jobNorm),
		cvSkills,
		jdSkills,
		similarity,
	)

	return prompt
}

func (s *comparisonService) saveProcessingStatusToRedis(comparisonID string) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	status := jobs.ComparisonStatus{
		Status: "processing",
		Result: nil,
	}

	jsonData, _ := json.Marshal(status)
	infra.RedisClient.Set(ctx, "cv:match:"+comparisonID, string(jsonData), 24*time.Hour)
}

/* ============================================================
   CLEAN JSON FROM LLM
   ============================================================ */

func (s *comparisonService) cleanLLMResponse(content string) string {
	content = strings.TrimSpace(content)

	// Remove ```json or ``` blocks
	content = strings.TrimPrefix(content, "```json")
	content = strings.TrimPrefix(content, "```")
	content = strings.TrimSuffix(content, "```")

	// Strip embedded fences
	re := regexp.MustCompile("```[a-zA-Z]*")
	content = re.ReplaceAllString(content, "")

	return strings.TrimSpace(content)
}

/* ============================================================
   LLM PROCESSOR
   ============================================================ */

func (s *comparisonService) processAndSaveComparison(ctx context.Context, comparisonID string, llmReq infra.LLMRequest) {

	llmResp, err := s.llmClient.Query(ctx, llmReq)
	if err != nil {
		s.saveFailedStatusToRedis(comparisonID, err.Error())
		return
	}

	if llmResp.Error != "" {
		s.saveFailedStatusToRedis(comparisonID, llmResp.Error)
		return
	}

	clean := s.cleanLLMResponse(llmResp.Content)

	var matchResult jobs.MatchResult
	err = json.Unmarshal([]byte(clean), &matchResult)
	if err != nil {
		utils.Log.Error("LLM JSON PARSE FAILED: " + err.Error())
		utils.Log.Error("RAW: " + clean)
		s.saveFailedStatusToRedis(comparisonID, "invalid JSON returned by model")
		return
	}

	s.saveCompletedResultToRedis(comparisonID, matchResult)
}

/* ============================================================
   SAVE STATES
   ============================================================ */

func (s *comparisonService) saveFailedStatusToRedis(comparisonID string, errorMessage string) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	status := jobs.ComparisonStatus{
		Status: "failed",
		Error:  errorMessage,
		Result: nil,
	}

	jsonData, _ := json.Marshal(status)
	infra.RedisClient.Set(ctx, "cv:match:"+comparisonID, string(jsonData), 24*time.Hour)
}

func (s *comparisonService) saveCompletedResultToRedis(comparisonID string, matchResult jobs.MatchResult) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	status := jobs.ComparisonStatus{
		Status: "completed",
		Result: &matchResult,
	}

	jsonData, _ := json.Marshal(status)
	infra.RedisClient.Set(ctx, "cv:match:"+comparisonID, string(jsonData), 24*time.Hour)
	utils.Log.Info("Completed result saved for " + comparisonID)
}
