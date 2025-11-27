"use client";

import TopFilters from "@/components/dashboard/TopFilters";
import ComparisonList from "@/components/dashboard/ComparisonList";
import DetailDrawer from "@/components/dashboard/DetailDrawer";
import { useState, useEffect } from "react";
import { getJobComparisons } from "@/lib/api/dashboard/jobs/getJobComparisons";
import type { GetJobComparisonsData } from "@/lib/api/dashboard/jobs/getJobComparisons";
import { handleApiCall } from "@/lib/api-handler";
import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [activeId] = useState<string | null>(null);
  const [, setFilters] = useState<{
    skill?: string;
    location?: string;
    minExperience?: number;
  } | null>(null);

  const accessToken = useAuthStore((s) => s.getAccessToken());
  const [comparisons, setComparisons] = useState<GetJobComparisonsData | null>(
    null
  );
  const [comparisonsLoading, setComparisonsLoading] = useState(true);
  const [comparisonsError, setComparisonsError] = useState<string | null>(null);
  // candidate states removed (overview uses job comparisons)

  // openCandidate removed - comparisons don't open candidate drawer by default

  useEffect(() => {
    let mounted = true;

    async function loadComparisons() {
      setComparisonsLoading(true);
      setComparisonsError(null);

      if (!accessToken) {
        setComparisons(null);
        setComparisonsLoading(false);
        return;
      }

      const res = await handleApiCall(() => getJobComparisons(), {
        onSuccess: (data) => {
          setComparisons(data || null);
        },
        onError: (msg) => setComparisonsError(msg),
        showSuccessToast: false,
      });

      if (!mounted) return;
      if (!res.success)
        setComparisonsError(res.message || "Failed to fetch comparisons");
      setComparisonsLoading(false);
    }

    loadComparisons();

    return () => {
      mounted = false;
    };
  }, [accessToken]);

  // Candidate load removed

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Navbar is provided globally via layout */}

        <div className="mt-6">
          {/* For 'overview' the filters are shown above the list. */}
          <div className="space-y-6">
            <TopFilters onApply={(f) => setFilters(f || null)} />

            <section>
              <ComparisonList
                comparisons={comparisons ?? null}
                loading={comparisonsLoading}
                error={comparisonsError}
              />
            </section>
          </div>
        </div>

        <DetailDrawer candidateId={activeId} open={open} setOpen={setOpen} />
      </div>
    </main>
  );
}
