"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import {
  LLMProviderId,
  LLMProviderDef,
  toBackendName,
} from "@/lib/api/llm/types";
import { addApiKey, AddLLMKeyRequest } from "@/lib/api/llm/addApiKey";
import { handleApiCall } from "@/lib/api-handler";

// Move to shared LLM context type
type LLMProvider = LLMProviderId;

export default function LLMSettings() {
  const [provider, setProvider] = useState<LLMProvider | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  async function save() {
    const backendName = toBackendName(provider || undefined);

    const payload: AddLLMKeyRequest = {
      name: provider || "my-key",
      provider: backendName,
      secret: apiKey,
    };

    const res = await handleApiCall(() => addApiKey(payload), {
      successMessage: "LLM key saved",
    });

    if (res.success) {
      setProvider(null);
      setApiKey("");
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold mb-4">LLM Settings (Dashboard)</h2>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <Label>Provider</Label>
            <div className="mt-2 flex gap-2">
              {(
                [
                  { id: "openai", label: "OpenAI" },
                  { id: "anthropic", label: "Anthropic" },
                  { id: "google", label: "Google Gemini" },
                ] as LLMProviderDef[]
              ).map((p) => (
                <button
                  key={p.id}
                  className={`rounded border px-3 py-1 text-sm ${
                    provider === p.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-card"
                  }`}
                  onClick={() => setProvider(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <Label>API Key</Label>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  className="text-foreground"
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-muted text-foreground hover:bg-muted/80"
                  onClick={() => setShowApiKey((s) => !s)}
                >
                  {showApiKey ? "Hide" : "Show"}
                </Button>
              </div>
              {/* Security note: explain encryption and storage to the user */}
              <div className="mt-2 text-sm text-muted-foreground flex items-start gap-2">
                <Info className="h-4 w-4 text-muted-foreground" aria-hidden />
                <div className="leading-tight">
                  API keys are encrypted if stored and used only by this app. We
                  never share your key.
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button onClick={save}>Save</Button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold text-card-foreground">Usage & Help</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Configure your LLM provider and API key here. The provider
              selection determines which model provider we will use when
              generating candidate summaries, prompts, and other automated
              features. Keep your keys secure — they&apos;re stored locally for
              demos. Note: API keys are only kept in-memory for the current
              session and are cleared on refresh. They are not persisted to
              disk.
            </p>
            <div className="mt-4 text-sm text-muted-foreground">
              <strong>Examples</strong>
              <ul className="mt-2 list-disc pl-5">
                {[
                  {
                    id: "openai",
                    label: "OpenAI",
                    description: "GPT-based completions",
                  },
                  {
                    id: "google",
                    label: "Google Gemini",
                    description: "Gemini models",
                  },
                  {
                    id: "anthropic",
                    label: "Anthropic",
                    description: "Claude models",
                  },
                ].map((p) => (
                  <li key={p.id}>
                    {p.label} — {p.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
