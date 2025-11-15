"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLLM, LLMProviderType } from "@/context/llm-context";

// Move to shared LLM context type
type LLMProvider = LLMProviderType;

export default function LLMSettings() {
  const [provider, setProvider] = useState<LLMProvider | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const { setProvider: setGlobalProvider, setApiKey: setGlobalApiKey } =
    useLLM();

  // No persistent storage: we intentionally keep UI empty on mount.

  function save() {
    // Do not persist keys. Save ephemeral settings in-memory via context
    // (cleared on refresh) so the app can use it during this session.
    setGlobalProvider(provider);
    setGlobalApiKey(apiKey);
    alert("Saved LLM settings (session only)");
    // clear the UI as requested
    setProvider(null);
    setApiKey("");
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 text-slate-900 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold mb-4">LLM Settings (Dashboard)</h2>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <Label>Provider</Label>
            <div className="mt-2 flex gap-2">
              <button
                className={`rounded border px-3 py-1 ${
                  provider === "openai" ? "bg-primary text-white" : "bg-white"
                }`}
                onClick={() => setProvider("openai")}
              >
                OpenAI
              </button>
              <button
                className={`rounded border px-3 py-1 ${
                  provider === "anthropic"
                    ? "bg-primary text-white"
                    : "bg-white"
                }`}
                onClick={() => setProvider("anthropic")}
              >
                Anthropic
              </button>
              <button
                className={`rounded border px-3 py-1 ${
                  provider === "gemini" ? "bg-primary text-white" : "bg-white"
                }`}
                onClick={() => setProvider("gemini")}
              >
                Google Gemini
              </button>
            </div>

            <div className="mt-4">
              <Label>API Key</Label>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApiKey((s) => !s)}
                >
                  {showApiKey ? "Hide" : "Show"}
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <Button onClick={save}>Save</Button>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900">Usage & Help</h3>
            <p className="mt-2 text-sm text-slate-600">
              Configure your LLM provider and API key here. The provider
              selection determines which model provider we will use when
              generating candidate summaries, prompts, and other automated
              features. Keep your keys secure — they&apos;re stored locally for
              demos. Note: API keys are only kept in-memory for the current
              session and are cleared on refresh. They are not persisted to
              disk.
            </p>
            <div className="mt-4 text-sm text-slate-600">
              <strong>Examples</strong>
              <ul className="mt-2 list-disc pl-5">
                <li>OpenAI — GPT-based completions</li>
                <li>Google Gemini — Gemini models</li>
                <li>Anthropic — Claude models</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
