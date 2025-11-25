"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { handleApiCall } from "@/lib/api-handler";
import { getJobById } from "@/lib/api/dashboard/jobs/getJobById";
import type { RawJob } from "@/lib/api/dashboard/jobs/getAllJobs";
import type { Job as UIJob } from "@/components/dashboard/jobs/JobForm";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function JobDetailPage() {
  const params = useParams();
  const id = params?.id;
  const accessToken = useAuthStore((s) => s.getAccessToken());
  const [job, setJob] = useState<UIJob | null>(null);
  const [rawJob, setRawJob] = useState<RawJob | null>(null);
  const [jobLoading, setJobLoading] = useState<boolean>(true);
  const [jobError, setJobError] = useState<string | null>(null);
  // Matching removed for now — this job detail page shows API data only
  const hasDetails = Boolean(
    rawJob?.details &&
      (rawJob.details?.requirements ||
        (rawJob.details?.benefits && rawJob.details?.benefits.length))
  );

  function mapRawJobToUI(job: RawJob | null | undefined): UIJob | null {
    if (!job) return null;
    return {
      id: job.id,
      title: job.title || "Untitled",
      description: job.description || undefined,
      details: {
        company:
          (job.details && typeof job.details.company === "string"
            ? String(job.details.company)
            : undefined) || undefined,
        requirements: job.details?.requirements || job.description || undefined,
        benefits:
          job.details && typeof job.details.benefits === "string"
            ? String(job.details.benefits)
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean)
            : (job.details?.benefits as string[] | undefined) || undefined,
        salary: job.details?.salary || undefined,
      },
    } as UIJob;
  }

  // matching disabled for now

  function formatDate(val: unknown): string {
    if (!val && val !== 0) return "-";
    try {
      const d = new Date(String(val));
      if (isNaN(d.getTime())) return String(val);
      return d.toLocaleString();
    } catch {
      return String(val);
    }
  }

  useEffect(() => {
    let mounted = true;
    async function loadJob() {
      setJobLoading(true);
      setJobError(null);
      setJob(null);
      if (!accessToken || !id) {
        setJobLoading(false);
        return;
      }
      const jobId =
        typeof id === "string" ? id : Array.isArray(id) ? id[0] : undefined;
      if (!jobId) {
        setJobError("Invalid job id");
        setJobLoading(false);
        return;
      }
      const res = await handleApiCall(() => getJobById(jobId), {
        onSuccess: (data) => {
          const raw = data?.job || null;
          const mapped = mapRawJobToUI(raw);
          if (mounted) {
            setRawJob(raw);
            setJob(mapped);
          }
        },
        onError: (msg) => {
          if (mounted) setJobError(msg);
        },
        showSuccessToast: false,
      });
      if (!mounted) return;
      if (!res.success) {
        setJobError(res.message || "Failed to fetch job");
      }
      setJobLoading(false);
    }
    loadJob();
    return () => {
      mounted = false;
    };
  }, [accessToken, id]);

  if (jobLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground py-8">
        <div className="mx-auto max-w-7xl px-6">Loading job...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground py-8">
      <div className="mx-auto max-w-7xl px-6">
        {/* Navbar provided globally in layout */}
        {jobError && (
          <div className="mb-4 text-sm text-destructive">{jobError}</div>
        )}
        <div className="rounded-lg bg-card border border-border p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2">
              <div className="mb-2">
                <div className="mb-2 flex items-center gap-3">
                  <Link
                    href="/dashboard/jobs"
                    className="text-sm text-primary hover:underline"
                    aria-label="Back to job list"
                  >
                    {`< Back`}
                  </Link>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-card-foreground">
                {job?.title || "Job not found"}
              </h2>
              <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                <div>{rawJob?.details?.company || "-"}</div>
                <Badge variant={rawJob?.is_active ? "default" : "outline"}>
                  {rawJob?.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 justify-start">
              <div className="text-sm text-muted-foreground">
                Salary:{" "}
                <span className="text-card-foreground font-semibold">
                  {rawJob?.details?.salary || "-"}
                </span>
              </div>
              <div className="text-xs text-muted-foreground text-right">
                <div>Created: {formatDate(rawJob?.created_at)}</div>
                <div>Updated: {formatDate(rawJob?.updated_at)}</div>
              </div>
              <div>
                {/* Back link moved above; right column retains Salary + timestamps only */}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <section>
            <Label>Job Description</Label>
            <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
              {job?.description || "No description provided"}
            </p>
          </section>

          <section className="mt-4">
            <Label>Details</Label>
            {!hasDetails && (
              <div className="mt-2 text-sm text-muted-foreground">
                No additional details provided
              </div>
            )}
            {hasDetails && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-sm text-muted-foreground">
                <div>
                  <div className="font-semibold text-card-foreground">
                    Requirements
                  </div>
                  <div className="whitespace-pre-wrap">
                    {rawJob?.details?.requirements || "Not specified"}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-card-foreground">
                    Benefits
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {(rawJob?.details?.benefits || []).map((b, i) => (
                      <Badge key={i} variant="secondary">
                        {b}
                      </Badge>
                    ))}
                    {(!rawJob?.details?.benefits ||
                      !rawJob?.details?.benefits.length) && (
                      <div className="text-muted-foreground">None listed</div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* created/updated timestamps are shown above in header */}
          </section>

          {/* Matching results removed — show raw job details above */}
        </div>
      </div>
    </main>
  );
}
