"use client";

import JobForm from "@/components/dashboard/jobs/JobForm";
import JobCard from "@/components/dashboard/jobs/JobCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { getAllJobs } from "@/lib/api/dashboard/jobs/getAllJobs";
import { handleApiCall } from "@/lib/api-handler";
import { useAuthStore } from "@/store/authStore";
import type { RawJob } from "@/lib/api/dashboard/jobs/getAllJobs";
import type { Job } from "@/components/dashboard/jobs/JobForm";

export default function JobsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [version, setVersion] = useState(0);
  const accessToken = useAuthStore((s) => s.getAccessToken());
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function mapRawJobToUI(job: RawJob): Job {
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
                .map((s) => s.trim())
                .filter(Boolean)
            : (job.details?.benefits as string[] | undefined) || undefined,
        salary: job.details?.salary || undefined,
      },
    };
  }

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      if (!accessToken) {
        setJobs([]);
        setLoading(false);
        return;
      }

      const res = await handleApiCall(() => getAllJobs(), {
        onSuccess: (data) => {
          setJobs((data?.jobs || []).map(mapRawJobToUI));
        },
        onError: (msg) => {
          setJobs([]);
          setError(msg);
        },
        showSuccessToast: false,
      });

      if (!mounted) return;
      if (!res.success) setError(res.message || "Failed to fetch Jobs");

      setLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, [accessToken, version]);

  return (
    <main className="min-h-screen bg-background text-foreground py-8">
      <div className="mx-auto max-w-7xl px-6">
        {/* Full width content */}
        <div className="w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Jobs</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Open positions
              </p>
            </div>

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button>Add job</Button>
              </DialogTrigger>

              <DialogContent className="bg-card text-card-foreground border-border">
                <DialogHeader className="px-6 pt-6">
                  <DialogTitle>Add job</DialogTitle>
                </DialogHeader>

                <div className="h-[min(80vh,720px)] w-full">
                  <JobForm
                    onCreate={() => {
                      setVersion((v) => v + 1);
                      setAddOpen(false);
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Job list */}
          <div>
            {loading ? (
              <div className="text-sm text-muted-foreground">
                Loading jobs...
              </div>
            ) : error ? (
              <div className="text-sm text-destructive">
                Failed to load jobs: {error}
              </div>
            ) : !jobs.length ? (
              <div className="text-sm text-muted-foreground">No jobs yet</div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {jobs.map((j) => (
                  <JobCard key={j.id} job={j} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
