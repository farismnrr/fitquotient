package infrastructure

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
)

// LLMProvider defines the type of LLM provider
type LLMProvider string

const (
	ProviderOpenAI    LLMProvider = "OPENAI"
	ProviderAnthropic LLMProvider = "ANTHROPIC"
	ProviderGoogle    LLMProvider = "GOOGLE"
)

// LLMRequest contains the common fields for LLM API requests
type LLMRequest struct {
	APIKey   string
	Model    string
	Query    string
	Provider LLMProvider
}

// LLMResponse contains the parsed response from LLM
type LLMResponse struct {
	Content string `json:"content"`
	Usage   Usage  `json:"usage,omitempty"`
	Error   string `json:"error,omitempty"`
}

// Usage contains token usage information
type Usage struct {
	InputTokens  int `json:"input_tokens,omitempty"`
	OutputTokens int `json:"output_tokens,omitempty"`
}

// LLMClient handles communication with different LLM providers
type LLMClient struct {
	httpClient *http.Client
}

// NewLLMClient creates a new LLM client
func NewLLMClient() *LLMClient {
	return &LLMClient{
		httpClient: &http.Client{},
	}
}

// Query sends a query to the specified LLM provider
func (c *LLMClient) Query(ctx context.Context, req LLMRequest) (*LLMResponse, error) {
	if req.APIKey == "" {
		return nil, errors.New("API key is required")
	}
	if req.Model == "" {
		return nil, errors.New("model is required")
	}
	if req.Query == "" {
		return nil, errors.New("query is required")
	}

	switch req.Provider {
	case ProviderOpenAI:
		return c.queryOpenAI(ctx, req)
	case ProviderAnthropic:
		return c.queryAnthropic(ctx, req)
	case ProviderGoogle:
		return c.queryGemini(ctx, req)
	default:
		return nil, fmt.Errorf("unsupported provider: %s", req.Provider)
	}
}

// queryOpenAI sends a request to OpenAI API
func (c *LLMClient) queryOpenAI(ctx context.Context, req LLMRequest) (*LLMResponse, error) {
	const openaiEndpoint = "https://api.openai.com/v1/chat/completions"

	payload := map[string]interface{}{
		"model": req.Model,
		"messages": []map[string]string{
			{
				"role":    "user",
				"content": req.Query,
			},
		},
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	httpReq, err := http.NewRequestWithContext(ctx, "POST", openaiEndpoint, io.NopCloser(bytes.NewReader(body)))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", fmt.Sprintf("Bearer %s", req.APIKey))

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return &LLMResponse{
			Error: fmt.Sprintf("OpenAI API error: %s", string(respBody)),
		}, nil
	}

	var openaiResp map[string]interface{}
	err = json.Unmarshal(respBody, &openaiResp)
	if err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	choices, ok := openaiResp["choices"].([]interface{})
	if !ok || len(choices) == 0 {
		return &LLMResponse{Error: "no choices in response"}, nil
	}

	choice, ok := choices[0].(map[string]interface{})
	if !ok {
		return &LLMResponse{Error: "invalid choice format"}, nil
	}

	message, ok := choice["message"].(map[string]interface{})
	if !ok {
		return &LLMResponse{Error: "invalid message format"}, nil
	}

	content, ok := message["content"].(string)
	if !ok {
		return &LLMResponse{Error: "invalid content format"}, nil
	}

	usage := Usage{}
	if usageData, ok := openaiResp["usage"].(map[string]interface{}); ok {
		if inputTokens, ok := usageData["prompt_tokens"].(float64); ok {
			usage.InputTokens = int(inputTokens)
		}
		if outputTokens, ok := usageData["completion_tokens"].(float64); ok {
			usage.OutputTokens = int(outputTokens)
		}
	}

	return &LLMResponse{
		Content: content,
		Usage:   usage,
	}, nil
}

// queryAnthropic sends a request to Anthropic API
func (c *LLMClient) queryAnthropic(ctx context.Context, req LLMRequest) (*LLMResponse, error) {
	const anthropicEndpoint = "https://api.anthropic.com/v1/messages"

	payload := map[string]interface{}{
		"model":       req.Model,
		"max_tokens":  1024,
		"messages": []map[string]string{
			{
				"role":    "user",
				"content": req.Query,
			},
		},
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	httpReq, err := http.NewRequestWithContext(ctx, "POST", anthropicEndpoint, io.NopCloser(bytes.NewReader(body)))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("x-api-key", req.APIKey)
	httpReq.Header.Set("anthropic-version", "2023-06-01")

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return &LLMResponse{
			Error: fmt.Sprintf("Anthropic API error: %s", string(respBody)),
		}, nil
	}

	var anthropicResp map[string]interface{}
	err = json.Unmarshal(respBody, &anthropicResp)
	if err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	content := ""
	if contentData, ok := anthropicResp["content"].([]interface{}); ok && len(contentData) > 0 {
		if textBlock, ok := contentData[0].(map[string]interface{}); ok {
			if text, ok := textBlock["text"].(string); ok {
				content = text
			}
		}
	}

	usage := Usage{}
	if usageData, ok := anthropicResp["usage"].(map[string]interface{}); ok {
		if inputTokens, ok := usageData["input_tokens"].(float64); ok {
			usage.InputTokens = int(inputTokens)
		}
		if outputTokens, ok := usageData["output_tokens"].(float64); ok {
			usage.OutputTokens = int(outputTokens)
		}
	}

	return &LLMResponse{
		Content: content,
		Usage:   usage,
	}, nil
}

// queryGemini sends a request to Google Gemini API
func (c *LLMClient) queryGemini(ctx context.Context, req LLMRequest) (*LLMResponse, error) {
	endpoint := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s", req.Model, req.APIKey)

	payload := map[string]interface{}{
		"contents": []map[string]interface{}{
			{
				"parts": []map[string]string{
					{
						"text": req.Query,
					},
				},
			},
		},
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	httpReq, err := http.NewRequestWithContext(ctx, "POST", endpoint, io.NopCloser(bytes.NewReader(body)))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return &LLMResponse{
			Error: fmt.Sprintf("Gemini API error: %s", string(respBody)),
		}, nil
	}

	var geminiResp map[string]interface{}
	err = json.Unmarshal(respBody, &geminiResp)
	if err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	content := ""
	if candidates, ok := geminiResp["candidates"].([]interface{}); ok && len(candidates) > 0 {
		if candidate, ok := candidates[0].(map[string]interface{}); ok {
			if contentData, ok := candidate["content"].(map[string]interface{}); ok {
				if parts, ok := contentData["parts"].([]interface{}); ok && len(parts) > 0 {
					if part, ok := parts[0].(map[string]interface{}); ok {
						if text, ok := part["text"].(string); ok {
							content = text
						}
					}
				}
			}
		}
	}

	usage := Usage{}
	if usageData, ok := geminiResp["usageMetadata"].(map[string]interface{}); ok {
		if inputTokens, ok := usageData["promptTokenCount"].(float64); ok {
			usage.InputTokens = int(inputTokens)
		}
		if outputTokens, ok := usageData["candidatesTokenCount"].(float64); ok {
			usage.OutputTokens = int(outputTokens)
		}
	}

	return &LLMResponse{
		Content: content,
		Usage:   usage,
	}, nil
}
