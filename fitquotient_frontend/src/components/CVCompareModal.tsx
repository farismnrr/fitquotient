"use client";

import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CVCompareModal({ compact }: { compact?: boolean }) {
  const dummyJobs = [
    { id: "job1", title: "Backend Engineer" },
    { id: "job2", title: "Frontend Engineer" },
    { id: "job3", title: "Product Engineer" },
  ];

  const dummyApiKeys = [
    { id: "key1", label: "OpenAI (prod)" },
    { id: "key2", label: "OpenAI (staging)" },
  ];

  const dummyCvs = [
    { id: "cv1", name: "Faris Munir" },
    { id: "cv2", name: "Miguel" },
    { id: "cv3", name: "Alice" },
  ];

  const dummyModels = ["text-embedding-3-small", "text-embedding-3-large"];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {compact ? (
          <Button variant="ghost" size="sm">
            Compare CV
          </Button>
        ) : (
          <Button variant="ghost">Compare CV</Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-card text-card-foreground border-border">
        <DialogHeader className="px-6 pt-6">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle>Compare CV</DialogTitle>
              <div className="text-sm text-muted-foreground mt-1">
                Use the controls below to pick a job, API key, user CV, and
                model to compare. This is a dummy UI for now.
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="h-[min(80vh,720px)] w-full">
          <div className="h-full flex flex-col">
            <div className="dialog-scroll px-6 py-4 space-y-4 overflow-y-auto text-sm text-muted-foreground">
              <div className="flex flex-col gap-4">
                <section>
                  <h4 className="font-semibold mb-2">All Jobs</h4>
                  <select className="rounded border px-2 py-1 w-full">
                    <option value="">Select job</option>
                    {dummyJobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                </section>

                <section>
                  <h4 className="font-semibold mb-2">API Keys</h4>
                  <select className="rounded border px-2 py-1 w-full">
                    <option value="">Select API key</option>
                    {dummyApiKeys.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.label}
                      </option>
                    ))}
                  </select>
                </section>

                <section>
                  <h4 className="font-semibold mb-2">User CV</h4>
                  <select className="rounded border px-2 py-1 w-full">
                    <option value="">Select CV</option>
                    {dummyCvs.map((cv) => (
                      <option key={cv.id} value={cv.id}>
                        {cv.name}
                      </option>
                    ))}
                  </select>
                </section>

                <section>
                  <h4 className="font-semibold mb-2">Model</h4>
                  <select className="rounded border px-2 py-1 w-full">
                    <option value="">Select model</option>
                    {dummyModels.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </section>

                <section>
                  <h4 className="font-semibold mb-2">Provider</h4>
                  <select
                    disabled
                    className="rounded border px-2 py-1 w-full bg-muted/50"
                  >
                    <option value="fitq">FitQuotient (default)</option>
                  </select>
                </section>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              Dummy state only
            </div>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button>Compare</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
