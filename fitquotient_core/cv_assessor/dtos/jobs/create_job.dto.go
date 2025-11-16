package jobs

type CreateJobDTO struct {
	JobID string `json:"jobId" validate:"required,uuid" form:"jobId"`
	Text  string `json:"text" validate:"required,min=10" form:"text"`
}
