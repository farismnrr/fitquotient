package jobs

type ComparisonResultResponseDTO struct {
	ComparisonID string      `json:"comparisonId"`
	Status       string      `json:"status"` // "processing" or "completed"
	Result       *MatchResult `json:"result,omitempty"`
}
