package jobs

import (
	"net/http"

	dtosCommons "cv_assessor/dtos/commons"
	dtosJobs "cv_assessor/dtos/jobs"
	respDtos "cv_assessor/dtos/responses"
	"cv_assessor/entities"
	jobSvc "cv_assessor/services"
	"cv_assessor/utils"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type JobHandler struct {
	jobService        jobSvc.JobService
	comparisonService jobSvc.ComparisonService
}

func NewJobHandler(jobService jobSvc.JobService, comparisonService jobSvc.ComparisonService) *JobHandler {
	return &JobHandler{
		jobService:        jobService,
		comparisonService: comparisonService,
	}
}

func (h *JobHandler) CreateJob(c *gin.Context) {
	var dto dtosJobs.CreateJobDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		_ = c.Error(err)
		return
	}

	validate := validator.New()
	if err := validate.Struct(&dto); err != nil {
		_ = c.Error(err)
		return
	}

	job := &entities.JobEntity{
		JobID: dto.JobID,
		Text:  dto.Text,
	}

	// Chunk the text
	chunker := utils.NewTextChunker()
	chunks := chunker.ChunkText(dto.Text)
	if len(chunks) == 0 {
		_ = c.Error(&gin.Error{Type: gin.ErrorTypePublic, Meta: "text is empty after chunking", Err: nil})
		return
	}

	// Generate vectors for each chunk (placeholder - should be replaced with actual embedding service)
	vectors := make([][]float32, len(chunks))
	for i := range chunks {
		vectors[i] = make([]float32, 384)
		// TODO: Replace this with actual embedding service
		// vectors[i] = embeddingService.Embed(chunks[i])
	}

	err := h.jobService.SaveJobWithChunks(c.Request.Context(), job, vectors)
	if err != nil {
		_ = c.Error(err)
		return
	}

	response := respDtos.GeneralResponse{
		IsSuccess: true,
		Message:   "Job created successfully",
		Data: dtosJobs.CreateJobResponseDTO{
			JobID: job.JobID,
		},
	}
	c.JSON(http.StatusCreated, response)
}

func (h *JobHandler) GetJob(c *gin.Context) {
	var dto dtosCommons.IDDTO
	if err := c.ShouldBindUri(&dto); err != nil {
		_ = c.Error(err)
		return
	}

	validate := validator.New()
	if err := validate.Struct(&dto); err != nil {
		_ = c.Error(err)
		return
	}

	job, err := h.jobService.GetJob(c.Request.Context(), dto.ID)
	if err != nil {
		_ = c.Error(err)
		return
	}

	response := respDtos.GeneralResponse{
		IsSuccess: true,
		Message:   "Job retrieved successfully",
		Data: dtosJobs.JobResponseDTO{
			JobID: job.JobID,
			Text:  job.Text,
		},
	}
	c.JSON(http.StatusOK, response)
}

func (h *JobHandler) DeleteJob(c *gin.Context) {
	var dto dtosCommons.IDDTO
	if err := c.ShouldBindUri(&dto); err != nil {
		_ = c.Error(err)
		return
	}

	validate := validator.New()
	if err := validate.Struct(&dto); err != nil {
		_ = c.Error(err)
		return
	}

	err := h.jobService.DeleteJob(c.Request.Context(), dto.ID)
	if err != nil {
		_ = c.Error(err)
		return
	}

	response := respDtos.GeneralResponse{
		IsSuccess: true,
		Message:   "Job deleted successfully",
	}
	c.JSON(http.StatusOK, response)
}

func (h *JobHandler) CompareCVJob(c *gin.Context) {
	var dto dtosJobs.CompareCVJobDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		_ = c.Error(err)
		return
	}

	validate := validator.New()
	if err := validate.Struct(&dto); err != nil {
		_ = c.Error(err)
		return
	}

	comparisonID, err := h.comparisonService.CompareCVJob(c.Request.Context(), dto.CVID, dto.JobID, dto.APIKey, dto.Model, dto.Provider, dto.ComparisonID)
	if err != nil {
		_ = c.Error(err)
		return
	}

	response := respDtos.GeneralResponse{
		IsSuccess: true,
		Message:   "Comparison queued successfully",
		Data: dtosJobs.CompareCVJobResponseDTO{
			ID:     comparisonID,
			Status: "enqueued",
		},
	}
	c.JSON(http.StatusAccepted, response)
}

func (h *JobHandler) GetComparisonResult(c *gin.Context) {
	var dto dtosCommons.ComparisonIDDTO
	if err := c.ShouldBindUri(&dto); err != nil {
		_ = c.Error(err)
		return
	}

	validate := validator.New()
	if err := validate.Struct(&dto); err != nil {
		_ = c.Error(err)
		return
	}

	comparisonStatus, err := h.comparisonService.GetComparisonResult(c.Request.Context(), dto.ID)
	if err != nil {
		_ = c.Error(err)
		return
	}

	response := respDtos.GeneralResponse{
		IsSuccess: true,
		Message:   "Comparison result retrieved successfully",
		Data: dtosJobs.ComparisonResultResponseDTO{
			ComparisonID: dto.ID,
			Status:       comparisonStatus.Status,
			Result:       comparisonStatus.Result,
		},
	}
	c.JSON(http.StatusOK, response)
}
