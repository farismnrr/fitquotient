package infrastructure

import (
	"context"
	"testing"
)

// TestQueryOpenAI tests the OpenAI provider (requires valid API key)
func TestQueryOpenAI(t *testing.T) {
	client := NewLLMClient()
	req := LLMRequest{
		APIKey:   "sk-test-key",
		Model:    "gpt-3.5-turbo",
		Query:    "test",
		Provider: ProviderOpenAI,
	}

	ctx := context.Background()
	resp, err := client.Query(ctx, req)

	// This will likely fail without valid API key, but shows usage
	if err != nil {
		t.Logf("Expected error without valid API key: %v", err)
	}
	if resp != nil {
		t.Logf("Response: %+v", resp)
	}
}

// TestQueryAnthropic tests the Anthropic provider
func TestQueryAnthropic(t *testing.T) {
	client := NewLLMClient()
	req := LLMRequest{
		APIKey:   "sk-ant-test-key",
		Model:    "claude-3-opus-20240229",
		Query:    "test",
		Provider: ProviderAnthropic,
	}

	ctx := context.Background()
	resp, err := client.Query(ctx, req)

	if err != nil {
		t.Logf("Expected error without valid API key: %v", err)
	}
	if resp != nil {
		t.Logf("Response: %+v", resp)
	}
}

// TestQueryGemini tests the Gemini provider
func TestQueryGemini(t *testing.T) {
	client := NewLLMClient()
	req := LLMRequest{
		APIKey:   "AIzaSy-test-key",
		Model:    "gemini-pro",
		Query:    "test",
		Provider: ProviderGoogle,
	}

	ctx := context.Background()
	resp, err := client.Query(ctx, req)

	if err != nil {
		t.Logf("Expected error without valid API key: %v", err)
	}
	if resp != nil {
		t.Logf("Response: %+v", resp)
	}
}

// TestValidation tests request validation
func TestValidation(t *testing.T) {
	client := NewLLMClient()
	ctx := context.Background()

	tests := []struct {
		name        string
		req         LLMRequest
		expectError bool
	}{
		{
			name: "Missing API Key",
			req: LLMRequest{
				Model:    "gpt-3.5-turbo",
				Query:    "test",
				Provider: ProviderOpenAI,
			},
			expectError: true,
		},
		{
			name: "Missing Model",
			req: LLMRequest{
				APIKey:   "sk-test",
				Query:    "test",
				Provider: ProviderOpenAI,
			},
			expectError: true,
		},
		{
			name: "Missing Query",
			req: LLMRequest{
				APIKey:   "sk-test",
				Model:    "gpt-3.5-turbo",
				Provider: ProviderOpenAI,
			},
			expectError: true,
		},
		{
			name: "Unsupported Provider",
			req: LLMRequest{
				APIKey:   "sk-test",
				Model:    "gpt-3.5-turbo",
				Query:    "test",
				Provider: "unknown",
			},
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := client.Query(ctx, tt.req)
			if (err != nil) != tt.expectError {
				t.Errorf("expected error: %v, got: %v", tt.expectError, err)
			}
		})
	}
}
