"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  return (
    <div className="rounded border border-border p-4 shadow-sm bg-card">
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
            {!isProcessing && typeof comp.result?.match_score === "number" && (
              <Badge variant="secondary">{comp.result?.match_score}</Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            {isProcessing ? "Processing..." : comp.result?.summary}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="bg-muted text-foreground hover:bg-muted/80"
                disabled={isProcessing}
                title={
                  isProcessing
                    ? "Details muted until processing is completed"
                    : undefined
                }
              >
                Details
              </Button>
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
                            comp.comparison_id.slice?.(0, 8) ||
                            comp.comparison_id
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
                          Vector similarity:{" "}
                          {comp.result?.vector_similarity ?? "—"}
                        </div>
                        <Separator className="my-3" />
                        <h4 className="font-medium">Summary</h4>
                        <p className="mt-1 text-sm">
                          {comp.result?.summary ?? "—"}
                        </p>
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
        </div>
      </div>
    </div>
  );
}
