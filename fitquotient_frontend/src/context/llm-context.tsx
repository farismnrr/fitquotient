"use client";

import React, { createContext, useContext, useState } from "react";

export type LLMProviderType = "openai" | "anthropic" | "gemini" | null;

type LLMContextValue = {
  provider: LLMProviderType;
  apiKey: string;
  setProvider: (p: LLMProviderType) => void;
  setApiKey: (k: string) => void;
};

const LLMContext = createContext<LLMContextValue | undefined>(undefined);

export function LLMProvider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<LLMProviderType>(null);
  const [apiKey, setApiKey] = useState("");

  return (
    <LLMContext.Provider value={{ provider, apiKey, setProvider, setApiKey }}>
      {children}
    </LLMContext.Provider>
  );
}

export function useLLM() {
  const ctx = useContext(LLMContext);
  if (!ctx) {
    throw new Error("useLLM must be used inside LLMProvider");
  }
  return ctx;
}
