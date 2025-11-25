"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function genId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export type CV = {
  id: string;
  name?: string;
  filename?: string;
  fileType?: string;
  fileData?: string | null;
  text?: string;
};

export default function CVForm({ onAdd }: { onAdd?: (cv: CV) => void }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileLabel, setFileLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function add() {
    // Keep UI-only behavior: add uploaded file information and optionally
    // read text for text files for compatibility with the naive keyword
    // matching found in Job details.
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string | null;

      // Make sure `fileData` is a data URL for download links — if we read
      // as text, convert to a base64 data url; otherwise reader.result is
      // already a data URL.
      let fileData = result || null;
      if (file.type.startsWith("text/") && typeof result === "string") {
        // Convert text to base64 data URL so downloads work consistently.
        try {
          const base64 = btoa(unescape(encodeURIComponent(result)));
          fileData = `data:${file.type || "text/plain"};base64,${base64}`;
        } catch {
          // Fallback to plain text; download may not work in older browsers.
          fileData = result;
        }
      }

      const cv: CV = {
        id: genId(),
        name: name || file.name || "CV",
        filename: file.name,
        fileType: file.type,
        fileData,
        text: text,
      };

      // UI-only: do not persist to localStorage. Call onAdd so parent
      // components can decide what to do with the CV.
      onAdd?.(cv);
      setName("");
      setText("");
      setFile(null);
      setFileLabel(null);
    };

    // Read either as text for simple file types or as a dataURL for download
    // For small UI-only usage we're OK with this.
    if (file.type.startsWith("text/") || file.name.endsWith(".txt")) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="rounded-lg border border-border p-4 bg-card">
      <h3 className="font-semibold text-card-foreground">Upload CV</h3>

      <div className="mt-3 space-y-3">
        <div>
          <Label>Name (for display)</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ")
              fileInputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragActive(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            const f = e.dataTransfer?.files?.[0] || null;
            if (!f) return;
            if (f.size > 5 * 1024 * 1024) {
              setFile(null);
              setFileLabel(null);
              setError("File too large — max 5MB");
              return;
            }
            setFile(f);
            setFileLabel(`${f.name} (${Math.round(f.size / 1024)} KB)`);
            if (f.type.startsWith("text/")) {
              const r = new FileReader();
              r.onload = () => setText(String(r.result || ""));
              r.readAsText(f);
            }
          }}
          className={
            "mt-2 w-full rounded border-2 p-4 text-sm cursor-pointer focus:outline-none " +
            (dragActive
              ? "border-primary bg-muted"
              : "border-dashed border-border bg-card")
          }
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.md"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setError(null);
              if (!f) return;
              if (f.size > 5 * 1024 * 1024) {
                setFile(null);
                setFileLabel(null);
                setError("File too large — max 5MB");
                return;
              }
              setFile(f);
              setFileLabel(
                f ? `${f.name} (${Math.round(f.size / 1024)} KB)` : null
              );
              if (f && f.type.startsWith("text/")) {
                const r = new FileReader();
                r.onload = () => setText(String(r.result || ""));
                r.readAsText(f);
              }
            }}
          />

          {!file && (
            <div className="text-sm text-muted-foreground">
              <div className="font-medium text-card-foreground">
                Drag & drop a file or click to upload
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                PDF, DOC, DOCX, TXT, MD — max 5MB
              </div>
            </div>
          )}

          {file && (
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-card-foreground">
                  {file.name}
                </div>
                <div className="text-xs text-muted-foreground">{fileLabel}</div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setFileLabel(null);
                    setText("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <Alert>
            <AlertTitle>Upload error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <Button onClick={add} disabled={!file}>
            Add CV
          </Button>
        </div>
      </div>
    </div>
  );
}
