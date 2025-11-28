"use client";

import React, { useEffect, useState } from "react";
import JobCard from "./JobCard";
import type { Job } from "./JobForm";
import { useAuthStore } from "@/store/authStore";
import { getAllJobs } from "@/lib/api/dashboard/jobs/getAllJobs";
import { handleApiCall } from "@/lib/api-handler";
import type { RawJob } from "@/lib/api/dashboard/jobs/getAllJobs";

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
              .map((s: string) => s.trim())
              .filter(Boolean)
          : (job.details?.benefits as string[] | undefined) || undefined,
      salary: job.details?.salary || undefined,
    },
  };
}

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useAuthStore((s) => s.getAccessToken());

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

      if (!res.success) {
        setError(res.message || "Failed to fetch Jobs");
      }

      setLoading(false);
    }

    load();

    return () => {
      mounted = false;
    };
  }, [accessToken]);

  if (loading)
    return <div className="text-sm text-muted-foreground">Loading jobs...</div>;
  if (error)
    return (
      <div className="text-sm text-destructive">
        Failed to load jobs: {error}
      </div>
    );
  if (!jobs.length)
    return <div className="text-sm text-muted-foreground">No jobs yet</div>;

  return (
    <div className="space-y-3">
      {jobs.map((j) => (
        <JobCard key={j.id} job={j} />
      ))}
    </div>
  );
}
