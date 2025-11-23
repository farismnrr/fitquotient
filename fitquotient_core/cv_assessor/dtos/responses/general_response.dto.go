package dtos

type GeneralResponse struct {
	IsSuccess bool        `json:"is_success"`
	Message   string      `json:"message"`
	Data      interface{} `json:"data"`
}
