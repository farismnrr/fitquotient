"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLLM } from "@/context/llm-context";

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

  const [job, setJob] = useState<Job | null>(null);
  const [cvs, setCvs] = useState<CV[]>([]);

  useEffect(() => {
    const jobs = JSON.parse(localStorage.getItem("jobs") || "[]") as Job[];
    setJob(jobs.find((j) => j.id === id) || null);

    const storedCvs = JSON.parse(localStorage.getItem("cvs") || "[]") as CV[];
    setCvs(storedCvs);
  }, [id]);

  type MatchResult = {
    id: string;
    name?: string;
    score: number;
    matches: string[];
  };
  const [result, setResult] = useState<MatchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { provider } = useLLM();

  // No effect needed: job is derived with useMemo and cvs is lazily
  // initialized from localStorage so we avoid a synchronous setState in
  // a useEffect (prevent cascading renders).

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
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 text-slate-900 py-8">
      <div className="mx-auto max-w-7xl px-6">
        {/* Navbar provided globally in layout */}
        <div className="rounded-lg bg-white border border-slate-200 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {job?.title || "Job not found"}
              </h2>
              <p className="text-sm text-slate-600">{job?.company}</p>
              <p className="text-xs text-slate-500 mt-1">
                Using LLM: <strong>{provider || "(none)"}</strong>
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
            <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">
              {job?.requirements}
            </p>
          </section>

          <div className="mt-6">
            <h3 className="font-semibold">Results</h3>
            {!result && <p className="text-sm text-slate-500">No result yet</p>}
            {result && (
              <div className="mt-3 space-y-2">
                {result.map((r) => (
                  <div
                    key={r.id}
                    className="rounded border border-slate-200 p-3 bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900">
                          {r.name}
                        </div>
                        <div className="text-xs text-slate-600">
                          Score: {r.score}
                        </div>
                      </div>
                      <div className="text-xs text-slate-600">
                        {r.matches.join(", ")}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      <strong>Explanation ({provider || "none"}):</strong>
                      <div className="mt-1 text-xs text-slate-600">
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
