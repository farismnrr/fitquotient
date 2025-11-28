"use client";

import { Badge } from "@/components/ui/badge";
import { truncate } from "@/lib/utils";
// Button no longer required here — card is clickable via DialogTrigger
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RawJobComparison } from "@/lib/api/dashboard/jobs/getJobComparisons";

export default function ComparisonCard({ comp }: { comp: RawJobComparison }) {
  const isProcessing = (comp.status || "").toLowerCase() === "processing";
  if (isProcessing) {
    // Render a non-interactive card when processing.
    return (
      <div
        className="block w-full rounded-lg border border-border bg-card p-4 opacity-60 cursor-not-allowed"
        aria-disabled={true}
        title="Processing..."
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-card-foreground">
                {comp.cv_name && comp.job_title
                  ? `${comp.cv_name} — ${comp.job_title}`
                  : comp.cv_name ||
                    comp.job_title ||
                    `Comparison ${
                      comp.comparison_id.slice?.(0, 8) || comp.comparison_id
                    }`}
              </h3>
              {!isProcessing &&
                typeof comp.result?.match_score === "number" && (
                  <Badge variant="secondary">{comp.result?.match_score}</Badge>
                )}
            </div>
            <p
              className="text-sm text-muted-foreground text-justify"
              title={comp.result?.summary ?? undefined}
            >
              {isProcessing
                ? "Processing..."
                : truncate(comp.result?.summary, 120)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Dialog>
      {/* Wrap the entire card in the trigger so clicking anywhere opens the details (like Jobs list). */}
      <DialogTrigger asChild>
        <button
          type="button"
          className="block w-full rounded-lg border border-border bg-card p-4 hover:shadow-md transition-shadow group"
          aria-label={`Open comparison ${
            comp.cv_name && comp.job_title
              ? `${comp.cv_name} — ${comp.job_title}`
              : comp.cv_name || comp.job_title || comp.comparison_id
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium text-card-foreground">
                  {comp.cv_name && comp.job_title
                    ? `${comp.cv_name} — ${comp.job_title}`
                    : comp.cv_name ||
                      comp.job_title ||
                      `Comparison ${
                        comp.comparison_id.slice?.(0, 8) || comp.comparison_id
                      }`}
                </h3>
                {!isProcessing &&
                  typeof comp.result?.match_score === "number" && (
                    <Badge variant="secondary">
                      {comp.result?.match_score}
                    </Badge>
                  )}
              </div>
              <p
                className="text-sm text-muted-foreground text-justify"
                title={comp.result?.summary ?? undefined}
              >
                {isProcessing
                  ? "Processing..."
                  : truncate(comp.result?.summary, 120)}
              </p>
            </div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="bg-card text-card-foreground border-border">
        <DialogHeader className="px-6 pt-6">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle>
                {comp.cv_name && comp.job_title
                  ? `${comp.cv_name} — ${comp.job_title}`
                  : comp.cv_name ||
                    comp.job_title ||
                    `Comparison ${
                      comp.comparison_id.slice?.(0, 8) || comp.comparison_id
                    }`}
              </DialogTitle>
              <div className="text-sm text-muted-foreground">
                {comp.cv_name && comp.job_title
                  ? `ID: ${comp.comparison_id}`
                  : `Status: ${comp.status ?? "—"}`}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="h-[min(80vh,720px)] w-full">
          <div className="h-full flex flex-col">
            <div className="dialog-scroll px-6 py-4 space-y-4 overflow-y-auto text-sm text-muted-foreground">
              {isProcessing ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-sm text-muted-foreground">
                    Processing...
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    Recommendation: {comp.result?.recommendation ?? "—"}
                  </div>
                  <div>
                    Vector similarity: {comp.result?.vector_similarity ?? "—"}
                  </div>
                  <Separator className="my-3" />
                  <h4 className="font-medium">Summary</h4>
                  <p className="mt-1 text-sm">{comp.result?.summary ?? "—"}</p>
                  <Separator className="my-3" />
                  <div>
                    <h4 className="font-medium">Top skill matches</h4>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {(comp.result?.skill_match || []).map((s) => (
                        <div
                          key={s}
                          className="rounded bg-muted px-2 py-1 text-muted-foreground"
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-medium">Missing skills</h4>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {(comp.result?.missing_skills || []).map((s) => (
                        <div
                          key={s}
                          className="rounded bg-destructive/10 px-2 py-1 text-destructive"
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
