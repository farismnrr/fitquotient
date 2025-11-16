package jobs

import (
	"net/http"

	dtosCommons "cv_assessor/dtos/commons"
	dtosJobs "cv_assessor/dtos/jobs"
	respDtos "cv_assessor/dtos/responses"
	"cv_assessor/entities"
	jobSvc "cv_assessor/services"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type JobHandler struct {
	jobService jobSvc.JobService
}

func NewJobHandler(jobService jobSvc.JobService) *JobHandler {
	return &JobHandler{
		jobService: jobService,
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

	vector := make([]float32, 384)

	err := h.jobService.SaveJobWithChunks(c.Request.Context(), job, vector)
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

	comparisonID, err := h.jobService.CompareCVJob(c.Request.Context(), dto.CVID, dto.JobID, dto.APIKey, dto.Model, dto.Provider)
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

	comparisonStatus, err := h.jobService.GetComparisonResult(c.Request.Context(), dto.ID)
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
