"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Job } from "./JobForm";

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-card-foreground">{job.title}</h4>
          <p className="text-sm text-muted-foreground">{job.company}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/jobs/${job.id}`}>
            <Button
              size="sm"
              variant="outline"
              className="bg-muted text-foreground hover:bg-muted/80"
            >
              Open
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
