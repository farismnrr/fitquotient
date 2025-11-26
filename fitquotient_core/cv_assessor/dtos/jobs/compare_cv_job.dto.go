package jobs

type CompareCVJobDTO struct {
	CVID      string `json:"cvId" validate:"required,uuid" form:"cvId"`
	JobID     string `json:"jobId" validate:"required,uuid" form:"jobId"`
	ComparisonID string `json:"comparisonId,omitempty" validate:"omitempty,uuid" form:"comparisonId"`
	APIKey    string `json:"apiKey" validate:"required" form:"apiKey"`
	Model     string `json:"model" validate:"required" form:"model"`
	Provider  string `json:"provider" validate:"required,oneof=OPENAI ANTHROPIC GOOGLE" form:"provider"`
}
