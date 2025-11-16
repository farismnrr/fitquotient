package jobs

type ComparisonStatus struct {
	Status string       `json:"status"` // "processing" atau "completed"
	Result *MatchResult `json:"result,omitempty"`
}
