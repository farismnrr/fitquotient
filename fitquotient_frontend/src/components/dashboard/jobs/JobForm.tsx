"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
function genId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export type Job = {
  id: string;
  title: string;
  company?: string;
  requirements?: string;
};

export default function JobForm({ onCreate }: { onCreate?: (j: Job) => void }) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [requirements, setRequirements] = useState("");

  function save() {
    const job: Job = { id: genId(), title, company, requirements };
    // UI-only: do not persist to localStorage. Call onCreate so parent
    // components (if they choose) can handle the addition in-memory.
    onCreate?.(job);
    setTitle("");
    setCompany("");
    setRequirements("");
  }

  return (
    <div className="rounded-lg border border-border p-4 bg-card">
      <h3 className="font-semibold text-card-foreground">
        Buat Job Description
      </h3>
      <div className="mt-3 grid gap-3">
        <div>
          <Label>Position Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <Label>Company</Label>
          <Input value={company} onChange={(e) => setCompany(e.target.value)} />
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

        <div className="pt-2">
          <Button onClick={save}>Create job</Button>
        </div>
      </div>
    </div>
  );
}
