"use client";

import { useState } from "react";
import CandidateCard from "./CandidateCard";
import type { Candidate } from "./mock-data";
import { candidates as mockCandidates } from "./mock-data";

export default function CandidateList({
  onOpen,
  filters,
}: {
  onOpen: (id: string) => void;
  filters?: {
    skill?: string;
    location?: string;
    minExperience?: number;
  } | null;
}) {
  const [candidates] = useState<Candidate[]>(mockCandidates);

  // Apply light-weight filters on client-side mock data
  const visible = candidates.filter((c) => {
    if (!filters) return true;
    if (filters.skill) {
      const s = filters.skill.toLowerCase();
      if (!c.matchedSkills.some((m) => m.skill.toLowerCase().includes(s))) {
        return false;
      }
    }
    if (filters.location) {
      const l = filters.location.toLowerCase();
      if (!(c.location || "").toLowerCase().includes(l)) {
        return false;
      }
    }
    if (typeof filters.minExperience === "number") {
      if ((c.experienceMonths || 0) < filters.minExperience) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
      {visible.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          No candidates match your filters
        </div>
      ) : (
        visible.map((c) => (
          <CandidateCard key={c.id} candidate={c} onOpen={onOpen} />
        ))
      )}
    </div>
  );
}
