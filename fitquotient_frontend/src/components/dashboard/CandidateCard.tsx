"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Candidate } from "./mock-data";

export default function CandidateCard({
  candidate,
  onOpen,
}: {
  candidate: Candidate;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="rounded border p-4 shadow-sm bg-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-slate-900">
              {candidate.name}
            </h3>
            <Badge variant="secondary">{candidate.fitScore}</Badge>
          </div>

          <p className="text-sm text-slate-600">{candidate.summary}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpen(candidate.id)}
          >
            Details
          </Button>
        </div>
      </div>

      <Separator className="my-3" />

      <div className="flex gap-2 text-xs mb-3">
        {candidate.location && (
          <div className="rounded bg-muted px-2 py-1 text-muted-foreground">
            {candidate.location}
          </div>
        )}
        {candidate.experienceMonths !== undefined && (
          <div className="rounded bg-muted px-2 py-1 text-muted-foreground">
            {candidate.experienceMonths} months
          </div>
        )}
      </div>

      <div className="flex gap-2 text-xs">
        {candidate.matchedSkills.slice(0, 3).map((s) => (
          <div
            key={s.skill}
            className="rounded bg-muted px-2 py-1 text-muted-foreground"
          >
            {s.skill} · {(s.score * 100).toFixed(0)}%
          </div>
        ))}
      </div>
    </div>
  );
}
