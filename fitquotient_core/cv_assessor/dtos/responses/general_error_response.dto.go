package dtos

type GeneralErrorResponse struct {
	IsSuccess bool   `json:"isSuccess"`
	Message   string `json:"message"`
}
