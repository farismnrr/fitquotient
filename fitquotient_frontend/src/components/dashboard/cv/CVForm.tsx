"use client";

import { useState, useRef } from "react";
import type { ChangeEvent, DragEvent, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// No in-body alert used — error shown in footer only
import { addUserCv } from "@/lib/api/dashboard/cv/addUserCv";
import type { RawCV } from "@/lib/api/dashboard/cv/getUserCvs";
import { handleApiCall } from "@/lib/api-handler";

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
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function add() {
    if (!file) return;
    setIsLoading(true);
    setError(null);

    await handleApiCall(() => addUserCv(file, name || undefined), {
      onSuccess: (data) => {
        // Normalize server response shapes that may be either { cv: RawCV } or { cv_id: string, url: string }
        const payload = data as unknown as Record<string, unknown>;
        let rawCv: RawCV | undefined = undefined;
        if (payload.cv && typeof payload.cv === "object") {
          rawCv = payload.cv as RawCV;
        } else if (typeof payload.cv_id === "string") {
          rawCv = {
            id: String(payload.cv_id),
            user_id:
              typeof payload["user_id"] === "string"
                ? (payload["user_id"] as string)
                : "",
            url: String(payload.url || ""),
            filename: undefined,
            mime_type: undefined,
            size: undefined,
            storage_provider: undefined,
            is_active: true,
            created_at: undefined,
            updated_at: undefined,
          };
        }

        if (!rawCv || !rawCv.id) {
          setError("Upload succeeded but response is missing CV id");
          return;
        }

        const cv: CV = {
          id: rawCv.id,
          name: name || rawCv.name || rawCv.filename || "CV",
          filename: rawCv.filename || undefined,
          fileType: rawCv.mime_type || undefined,
          fileData: rawCv.url || undefined,
          text: text,
        };
        onAdd?.(cv);
        setName("");
        setText("");
        setFile(null);
        setFileLabel(null);
      },
      onError: (err) => {
        setError(err || "Failed to upload CV");
      },
    });

    setIsLoading(false);
  }

  return (
    <div className="h-full flex flex-col">
      <div className="dialog-scroll px-6 py-4 space-y-4 overflow-y-auto">
        <div className="space-y-3">
          <div>
            <Label>Name (for display)</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <motion.div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" || e.key === " ")
                fileInputRef.current?.click();
            }}
            onDragOver={(e: DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e: DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDrop={(e: DragEvent<HTMLDivElement>) => {
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
              // Only allow PDFs
              if (
                f.type !== "application/pdf" &&
                !f.name.toLowerCase().endsWith(".pdf")
              ) {
                setFile(null);
                setFileLabel(null);
                setError("Only PDF files are supported");
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
            // animate scale slightly and change background/border while dragging
            animate={{ scale: dragActive ? 1.01 : 1 }}
            transition={{ duration: 0.12 }}
            className={
              "mt-2 w-full rounded border-2 p-4 text-sm cursor-pointer focus:outline-none " +
              (dragActive
                ? "border-primary bg-muted ring-2 ring-primary/10"
                : "border-dashed border-border bg-card")
            }
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const f = e.target.files?.[0] || null;
                setError(null);
                if (!f) return;
                if (f.size > 5 * 1024 * 1024) {
                  setFile(null);
                  setFileLabel(null);
                  setError("File too large — max 5MB");
                  return;
                }
                // Only allow PDFs
                if (
                  f.type !== "application/pdf" &&
                  !f.name.toLowerCase().endsWith(".pdf")
                ) {
                  setFile(null);
                  setFileLabel(null);
                  setError("Only PDF files are supported");
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
              <div className="text-sm text-muted-foreground flex items-center gap-3">
                <motion.div
                  animate={{
                    y: dragActive ? -4 : 0,
                    opacity: dragActive ? 1 : 0.9,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex items-center justify-center"
                >
                  <UploadCloud className="w-6 h-6 text-muted-foreground" />
                </motion.div>
                <div>
                  <div className="font-medium text-card-foreground">
                    Drag & drop a file or click to upload
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    PDF — max 5MB
                  </div>
                </div>
              </div>
            )}

            {file && (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-card-foreground">
                    {file.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {fileLabel}
                  </div>
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
          </motion.div>

          {/* remove in-body alert; show error in the sticky footer */}
        </div>
      </div>

      <div className="px-6 py-3 border-t border-border bg-card sticky bottom-0">
        {error && <div className="text-sm text-destructive mb-2">{error}</div>}
        <div className="flex justify-end">
          <Button onClick={add} disabled={!file || isLoading}>
            {isLoading ? "Uploading..." : "Add CV"}
          </Button>
        </div>
      </div>
    </div>
  );
}
