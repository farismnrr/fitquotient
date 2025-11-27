"use client";

import type { GetJobComparisonsData } from "@/lib/api/dashboard/jobs/getJobComparisons";

export default function AnalyticsRow({
  comparisons,
  loading,
  error,
}: {
  comparisons?: GetJobComparisonsData | null;
  loading?: boolean;
  error?: string | null;
}) {
  const processed = comparisons?.length ?? 0;

  // Average of match_score across comparisons with a numeric match_score
  const scores = (comparisons || [])
    .map((c) => c.result?.match_score)
    .filter((s): s is number => typeof s === "number");
  const averageScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;

  // Aggregate missing skills
  const missingSkillsCounts: Record<string, number> = {};
  (comparisons || []).forEach((c) => {
    (c.result?.missing_skills || []).forEach((s) => {
      if (!s) return;
      missingSkillsCounts[s] = (missingSkillsCounts[s] || 0) + 1;
    });
  });
  const topMissingSkills = Object.entries(missingSkillsCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([skill]) => skill);

  return (
    <div className="mt-4 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="rounded border border-border p-4 bg-card">
          # processed: <strong>{loading ? "..." : processed}</strong>
        </div>
        <div className="rounded border border-border p-4 bg-card">
          Average Fit Score:{" "}
          <strong>{loading ? "..." : averageScore ?? "-"}</strong>
        </div>
        <div className="rounded border border-border p-4 bg-card">
          Top missing skills:
          {loading ? (
            <span className="ml-2">...</span>
          ) : error ? (
            <span className="ml-2 text-destructive">Failed to load</span>
          ) : !topMissingSkills.length ? (
            <span className="ml-2">—</span>
          ) : (
            <ul className="ml-2 inline">
              {topMissingSkills.map((s) => (
                <li key={s} className="inline mr-2">
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
