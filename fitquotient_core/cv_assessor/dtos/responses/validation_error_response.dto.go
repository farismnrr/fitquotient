package dtos

type ValidationDetail struct {
	Field string `json:"field"`
	Error string `json:"error"`
}

type ValidationErrorResponse struct {
	IsSuccess bool               `json:"isSuccess"`
	Message   string             `json:"message"`
	Details   []ValidationDetail `json:"details"`
}
