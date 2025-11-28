"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Job } from "./JobForm";
import { truncate } from "@/lib/utils";

export default function JobCard({ job }: { job: Job }) {
  return (
    <Link
      href={`/dashboard/jobs/${job.id}`}
      className="block w-full rounded-lg border border-border bg-card p-4 hover:shadow-md transition-shadow group"
      aria-label={`Open job ${job.title}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-card-foreground">
            {job.title}
          </h4>
          {job.details?.company ? (
            <p className="text-sm text-muted-foreground">
              {job.details.company}
            </p>
          ) : null}
          {job.details?.salary ? (
            <p className="text-sm text-muted-foreground">
              {job.details.salary}
            </p>
          ) : null}
          {Array.isArray(job.details?.benefits) &&
          job.details.benefits.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {job.details.benefits.map((b, idx) => (
                <Badge key={idx} variant="secondary">
                  {b}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex gap-2 items-center">
          {/* action placeholders (if any) - removed Open button since card is clickable */}
        </div>
      </div>
      {job.details?.requirements && (
        <p className="mt-2 text-sm text-muted-foreground">
          {truncate(job.details.requirements, 120)}
        </p>
      )}
    </Link>
  );
}
