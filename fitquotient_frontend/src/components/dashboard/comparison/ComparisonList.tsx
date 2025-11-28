"use client";

import ComparisonCard from "./ComparisonCard";
import type { RawJobComparison } from "@/lib/api/dashboard/jobs/getJobComparisons";

export default function ComparisonList({
  comparisons,
  loading,
  error,
}: {
  comparisons?: RawJobComparison[] | null;
  loading?: boolean;
  error?: string | null;
}) {
  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading comparisons…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Failed to load comparisons: {error}
      </div>
    );
  }

  const items = comparisons || [];

  if (!items.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No comparisons yet
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-3">
      {items.map((c) => (
        <ComparisonCard key={c.comparison_id} comp={c} />
      ))}
    </div>
  );
}
