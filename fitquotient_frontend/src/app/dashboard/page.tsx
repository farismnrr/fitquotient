"use client";

// Sidebar kept for other pages; overview uses top filters instead.
import TopFilters from "@/components/dashboard/TopFilters";
import CandidateList from "@/components/dashboard/CandidateList";
import DetailDrawer from "@/components/dashboard/DetailDrawer";
import AnalyticsRow from "@/components/dashboard/AnalyticsRow";
import { useState } from "react";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    skill?: string;
    location?: string;
    minExperience?: number;
  } | null>(null);

  const openCandidate = (id: string) => {
    setActiveId(id);
    setOpen(true);
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Navbar is provided globally via layout */}

        <div className="mt-6">
          {/* For 'overview' the filters are shown above the list. */}
          <div className="space-y-6">
            <TopFilters onApply={(f) => setFilters(f || null)} />

            <section>
              <CandidateList onOpen={openCandidate} filters={filters} />
            </section>

            <AnalyticsRow />
          </div>
        </div>

        <DetailDrawer candidateId={activeId} open={open} setOpen={setOpen} />
      </div>
    </main>
  );
}
