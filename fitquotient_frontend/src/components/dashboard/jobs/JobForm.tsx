"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { handleApiCall } from "@/lib/api-handler";
import { addJob } from "@/lib/api/dashboard/jobs/addJob";
import type { AddJobRequest } from "@/lib/api/dashboard/jobs/addJob";
function genId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export type Job = {
  id: string;
  title: string;
  description?: string;
  details?: {
    company?: string;
    requirements?: string;
    benefits?: string[];
    salary?: string | null;
  };
};

export default function JobForm({ onCreate }: { onCreate?: (j: Job) => void }) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [benefitInput, setBenefitInput] = useState("");
  const [salary, setSalary] = useState("");
  // no network interaction in UI-only mode
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function save() {
    setError(null);
    if (!title.trim()) return setError("Title is required");
    if (!requirements.trim()) return setError("Requirements/JD is required");
    // Include any pending text in benefitInput
    const allBenefits = [
      ...benefits,
      ...benefitInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ];
    if (!allBenefits.length) return setError("Please add at least one benefit");

    const payload: AddJobRequest = {
      title: title.trim(),
      description: description.trim() || undefined,
      details: {
        company: company || undefined,
        requirements: requirements.trim(),
        benefits: allBenefits,
        salary: salary || null,
      },
    };
    setIsLoading(true);

    await handleApiCall(() => addJob(payload), {
      onSuccess: (data) => {
        const jobId = data?.job_id || genId();
        const j: Job = {
          id: String(jobId),
          title: payload.title,
          description: payload.description,
          details: {
            ...(payload.details || {}),
            company: company || payload.details?.company || undefined,
          },
        };
        onCreate?.(j);
        // reset UI fields
        setTitle("");
        setCompany("");
        setDescription("");
        setRequirements("");
        setBenefits([]);
        setBenefitInput("");
        setSalary("");
      },
      onError: (err) => {
        setError(err || "Failed to create job");
      },
      successMessage: "Job created successfully",
    });

    setIsLoading(false);
  }

  return (
    <div className="h-full flex flex-col">
      <div className="overflow-y-auto dialog-scroll px-6 py-4 space-y-4">
        <div>
          <Label>Position Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <Label>Company</Label>
          <Input value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>

        <div>
          <Label>Description (optional)</Label>
          <textarea
            className="mt-2 w-full rounded border p-2 text-sm"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <Label>Requirements / JD</Label>
          <textarea
            className="mt-2 w-full rounded border p-2 text-sm"
            rows={5}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          />
        </div>

        <div>
          <Label>Benefits (comma separated) — required</Label>
          <div className="mt-2 flex items-center gap-2">
            <Input
              value={benefitInput}
              onChange={(e) => setBenefitInput(e.target.value)}
              placeholder="E.g., Paid time off, Device allowance"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const parts = benefitInput
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  if (parts.length) {
                    setBenefits((b) => [...b, ...parts]);
                    setBenefitInput("");
                  }
                }
              }}
            />
            <Button
              onClick={() => {
                const parts = benefitInput
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
                if (parts.length) {
                  setBenefits((b) => [...b, ...parts]);
                  setBenefitInput("");
                }
              }}
            >
              Add
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {benefits.map((b, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <span>{b}</span>
                <button
                  className="ml-2 rounded px-1 text-xs"
                  onClick={() =>
                    setBenefits((cur) => cur.filter((_, i) => i !== idx))
                  }
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label>Salary (optional)</Label>
          <Input value={salary} onChange={(e) => setSalary(e.target.value)} />
        </div>

        {/* work_setup removed — streamlining details to benefits + salary */}
      </div>

      <div className="px-6 py-3 border-t border-border bg-card sticky bottom-0">
        {error && <div className="text-sm text-destructive mb-2">{error}</div>}
        <div className="flex justify-end">
          <Button onClick={save} disabled={isLoading}>
            {isLoading ? "Creating…" : "Create job"}
          </Button>
        </div>
      </div>
    </div>
  );
}
