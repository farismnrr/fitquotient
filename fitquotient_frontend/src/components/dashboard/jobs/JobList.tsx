"use client";

import React, { useState } from "react";
import JobCard from "./JobCard";
import type { Job } from "./JobForm";

export default function JobList() {
  const [jobs] = useState<Job[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem("jobs") || "[]") as Job[];
    }
    return [];
  });

  if (!jobs.length) return <div>No jobs yet</div>;

  return (
    <div className="space-y-3">
      {jobs.map((j) => (
        <JobCard key={j.id} job={j} />
      ))}
    </div>
  );
}
