package jobs

type CompareCVJobResponseDTO struct {
	ID           string `json:"id"`
	Status       string `json:"status"`
	LLMResponse  string `json:"llmResponse,omitempty"`
	Similarity   float32 `json:"similarity,omitempty"`
	TokensUsed   int    `json:"tokensUsed,omitempty"`
}
