"use client";

import JobForm from "@/components/dashboard/jobs/JobForm";
import JobList from "@/components/dashboard/jobs/JobList";
// No filters for Jobs page — keep it simple with a Add modal above the list
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
// DashboardHeader removed; Navbar is global

export default function JobsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [version, setVersion] = useState(0);
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 text-slate-900 py-8">
      <div className="mx-auto max-w-7xl px-6">
        {/* Navbar provided in layout */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold mb-4">Jobs</h2>
          <div className="flex items-center gap-2">
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button>Add job</Button>
              </DialogTrigger>
              <DialogContent className="bg-white text-slate-900 border-slate-200">
                <DialogHeader>
                  <DialogTitle>Add job</DialogTitle>
                </DialogHeader>
                <JobForm
                  onCreate={() => {
                    setVersion((v) => v + 1);
                    setAddOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <section className="mt-4">
          <JobList key={version} />
        </section>
      </div>
    </main>
  );
}
