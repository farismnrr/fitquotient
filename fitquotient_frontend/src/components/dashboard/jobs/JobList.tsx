"use client";

import React from "react";
import JobCard from "./JobCard";
import type { Job } from "./JobForm";
import { jobs as mockJobs } from "../mock-data";

export default function JobList() {
  const jobs: Job[] = mockJobs;

  if (!jobs.length) return <div>No jobs yet</div>;

  return (
    <div className="space-y-3">
      {jobs.map((j) => (
        <JobCard key={j.id} job={j} />
      ))}
    </div>
  );
}
