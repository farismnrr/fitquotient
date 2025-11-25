"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  jobs as mockJobs,
  cvs as mockCvs,
} from "@/components/dashboard/mock-data";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
// No global LLM context used any more - do not fetch stored provider

export default function JobDetailPage() {
  const params = useParams();
  const id = params?.id;
  type Job = {
    id: string;
    title?: string;
    company?: string;
    requirements?: string;
  };

  type CV = {
    id: string;
    name?: string;
    filename?: string;
    fileType?: string;
    fileData?: string;
    text?: string;
  };

  const job = mockJobs.find((j) => j.id === id) || null;
  const cvs = mockCvs;

  type MatchResult = {
    id: string;
    name?: string;
    score: number;
    matches: string[];
  };
  const [result, setResult] = useState<MatchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  // No stored provider: leave providerLabel unset
  const providerLabel = null;

  // No effect needed: job is derived from static mock data and cvs are
  // provided via the mock list — no localStorage or persistence involved.

  function checkMatching() {
    setLoading(true);
    setTimeout(() => {
      // Simple keyword matching: score by matching requirement words
      const requirements = (job?.requirements || "").toLowerCase();
      const terms = requirements.split(/\W+/).filter(Boolean);
      const ranked = cvs.map((cv) => {
        const text = (cv.text || "").toLowerCase();
        const matches = terms.filter((t: string) => text.includes(t));
        const score = Math.min(
          100,
          Math.round((matches.length / Math.max(1, terms.length)) * 100)
        );
        return { id: cv.id, name: cv.name, score, matches };
      });
      setResult(ranked.sort((a, b) => b.score - a.score));
      setLoading(false);
    }, 400);
  }

  return (
    <main className="min-h-screen bg-background text-foreground py-8">
      <div className="mx-auto max-w-7xl px-6">
        {/* Navbar provided globally in layout */}
        <div className="rounded-lg bg-card border border-border p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-card-foreground">
                {job?.title || "Job not found"}
              </h2>
              <p className="text-sm text-muted-foreground">{job?.company}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Using LLM: <strong>{providerLabel || "(none)"}</strong>
              </p>
            </div>
            <div>
              <Button
                onClick={checkMatching}
                disabled={!cvs.length || !!loading}
              >
                {loading ? "Checking..." : "Check matching"}
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          <section>
            <Label>Job Requirement</Label>
            <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
              {job?.requirements}
            </p>
          </section>

          <div className="mt-6">
            <h3 className="font-semibold">Results</h3>
            {!result && (
              <p className="text-sm text-muted-foreground">No result yet</p>
            )}
            {result && (
              <div className="mt-3 space-y-2">
                {result.map((r) => (
                  <div
                    key={r.id}
                    className="rounded border border-border p-3 bg-card"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-card-foreground">
                          {r.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Score: {r.score}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {r.matches.join(", ")}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <strong>Explanation ({providerLabel || "none"}):</strong>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Matched {r.matches.length} terms from the job
                        requirements: {r.matches.join(", ")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
