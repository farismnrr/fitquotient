package cvs

import (
	"net/http"

	dtosCommons "cv_assessor/dtos/commons"
	dtosCvs "cv_assessor/dtos/cvs"
	respDtos "cv_assessor/dtos/responses"
	"cv_assessor/entities"
	cvSvc "cv_assessor/services"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type CVHandler struct {
	cvService cvSvc.CVService
}

func NewCVHandler(cvService cvSvc.CVService) *CVHandler {
	return &CVHandler{
		cvService: cvService,
	}
}

func (h *CVHandler) CreateCV(c *gin.Context) {
	var dto dtosCvs.CreateCVDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		_ = c.Error(err)
		return
	}

	validate := validator.New()
	if err := validate.Struct(&dto); err != nil {
		_ = c.Error(err)
		return
	}

	cv := &entities.CvEntity{
		UserId:    dto.UserID,
		Filename:  dto.Filename,
		SourceUrl: dto.SourceURL,
		Text:      dto.Text,
	}

	vector := make([]float32, 384)

	err := h.cvService.SaveCVWithChunks(c.Request.Context(), cv, vector)
	if err != nil {
		_ = c.Error(err)
		return
	}

	response := respDtos.GeneralResponse{
		IsSuccess: true,
		Message:   "CV created successfully",
		Data: dtosCvs.CreateCVResponseDTO{
			CVId: cv.CVId,
		},
	}
	c.JSON(http.StatusCreated, response)
}

func (h *CVHandler) GetCV(c *gin.Context) {
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

	cv, err := h.cvService.GetCV(c.Request.Context(), dto.ID)
	if err != nil {
		_ = c.Error(err)
		return
	}

	response := respDtos.GeneralResponse{
		IsSuccess: true,
		Message:   "CV retrieved successfully",
		Data: dtosCvs.CVResponseDTO{
			CVId:      cv.CVId,
			UserId:    cv.UserId,
			Filename:  cv.Filename,
			SourceUrl: cv.SourceUrl,
			Text:      cv.Text,
		},
	}
	c.JSON(http.StatusOK, response)
}

func (h *CVHandler) DeleteCV(c *gin.Context) {
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

	err := h.cvService.DeleteCV(c.Request.Context(), dto.ID)
	if err != nil {
		_ = c.Error(err)
		return
	}

	response := respDtos.GeneralResponse{
		IsSuccess: true,
		Message:   "CV deleted successfully",
	}
	c.JSON(http.StatusOK, response)
}
