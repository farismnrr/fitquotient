"use client";

import React, { useEffect, useState } from "react";
import JobCard from "./JobCard";
import type { Job } from "./JobForm";
import { useAuthStore } from "@/store/authStore";
import { getAllJobs } from "@/lib/api/dashboard/jobs/jobs";
import { handleApiCall } from "@/lib/api-handler";
import type { RawJob } from "@/lib/api/dashboard/jobs/jobs";

function mapRawJobToUI(job: RawJob): Job {
  return {
    id: job.id,
    title: job.title || "Untitled",
    company: undefined,
    requirements: job.requirements || job.description || undefined,
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
        // Access token absent; just clear and stop
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
