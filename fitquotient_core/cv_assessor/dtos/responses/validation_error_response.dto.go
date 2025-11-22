package dtos

type ValidationDetail struct {
	Field string `json:"field"`
	Error string `json:"error"`
}

type ValidationErrorResponse struct {
	IsSuccess bool               `json:"is_success"`
	Message   string             `json:"message"`
	Details   []ValidationDetail `json:"details"`
}
