package dtos

type GeneralErrorResponse struct {
	IsSuccess bool   `json:"is_success"`
	Message   string `json:"message"`
}
