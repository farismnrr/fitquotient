"use client";

import React, { useEffect, useState } from "react";
import JobCard from "./JobCard";
import type { Job } from "./JobForm";

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem("jobs") || "[]") as Job[];
    setJobs(s);
  }, []);

  if (!jobs.length) return <div>No jobs yet</div>;

  return (
    <div className="space-y-3">
      {jobs.map((j) => (
        <JobCard key={j.id} job={j} />
      ))}
    </div>
  );
}
