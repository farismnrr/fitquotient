package jobs

type ComparisonStatus struct {
	Status string       `json:"status"` // "processing", "completed", atau "failed"
	Result *MatchResult `json:"result,omitempty"`
	Error  string       `json:"error,omitempty"` // Error message jika status "failed"
}
