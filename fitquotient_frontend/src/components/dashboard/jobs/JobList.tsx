"use client";

import React from "react";
import JobCard from "./JobCard";
import type { Job } from "./JobForm";

export default function JobList() {
  const jobs = JSON.parse(localStorage.getItem("jobs") || "[]") as Job[];

  if (!jobs.length) return <div>No jobs yet</div>;

  return (
    <div className="space-y-3">
      {jobs.map((j) => (
        <JobCard key={j.id} job={j} />
      ))}
    </div>
  );
}
