"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Job } from "./JobForm";

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-slate-900">{job.title}</h4>
          <p className="text-sm text-slate-600">{job.company}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/jobs/${job.id}`}>
            <Button
              size="sm"
              variant="outline"
              className="bg-slate-50 text-slate-900 hover:bg-slate-100"
            >
              Open
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
