// LLM provider types and small helpers used by the LLM API client
export type LLMProviderId = "openai" | "anthropic" | "google";
export type LLMBackendName = "OPENAI" | "ANTHROPIC" | "GOOGLE";

// Simple conversion helper used by pages to convert an ID to the
// backend provider name expected by the core API.
export function toBackendName(id?: LLMProviderId): LLMBackendName | undefined {
  if (!id) return undefined;
  switch (id) {
    case "openai":
      return "OPENAI";
    case "anthropic":
      return "ANTHROPIC";
    case "google":
      return "GOOGLE";
    default:
      return undefined;
  }
}

export interface LLMProviderDef {
  id: LLMProviderId;
  label: string;
  description?: string;
}
