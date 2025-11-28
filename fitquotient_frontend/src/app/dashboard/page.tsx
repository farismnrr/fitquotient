"use client";

import TopFilters from "@/components/dashboard/filters/TopFilters";
import ComparisonList from "@/components/dashboard/comparison/ComparisonList";
import DetailDrawer from "@/components/dashboard/details/DetailDrawer";
import { useState, useEffect, useCallback } from "react";
import { getJobComparisons } from "@/lib/api/dashboard/jobs/getJobComparisons";
import type {
  GetJobComparisonsData,
  RawJobComparison,
} from "@/lib/api/dashboard/jobs/getJobComparisons";
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

  const loadComparisons = useCallback(
    async (opts: { background?: boolean } = {}) => {
      if (!opts.background) {
        setComparisonsLoading(true);
      }
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

      if (!res.success)
        setComparisonsError(res.message || "Failed to fetch comparisons");
      if (!opts.background) {
        setComparisonsLoading(false);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    let mounted = true;

    // initial load (non-background so UI shows loading state)
    const load = async () => {
      if (!mounted) return;
      await loadComparisons();
    };

    load();

    return () => {
      mounted = false;
    };
  }, [loadComparisons]);

  useEffect(() => {
    interface ComparisonDetail {
      comparison?: RawJobComparison;
    }
    
    const handler = (ev: Event) => {
      const custom = ev as CustomEvent;
      const detail = custom.detail as ComparisonDetail | undefined;
      if (detail?.comparison) {
        setComparisons((prev) => {
          const comparison = detail.comparison!;
          const exists = (prev || []).some(
            (c) => c.comparison_id === comparison.comparison_id
          );
          if (exists) return prev;
          return [comparison, ...(prev || [])];
        });
      }
      // Trigger a full reload in background to reconcile optimistic comparison with the server.
      loadComparisons({ background: true });
    };

    if (typeof window !== "undefined") {
      window.addEventListener("job:comparison:created", handler);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("job:comparison:created", handler);
      }
    };
  }, [loadComparisons, setComparisons]);

  // Poll for comparisons only when any has status "processing".
  useEffect(() => {
    let timer: number | null = null;

    const hasProcessing = (comparisons || []).some(
      (c) => (c.status || "").toLowerCase() === "processing"
    );

    if (!accessToken) return;

    if (hasProcessing) {
      // poll every 5 seconds in background (do not show loading UI)
      timer = window.setInterval(
        () => loadComparisons({ background: true }),
        5000
      );
    }

    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [comparisons, accessToken, loadComparisons]);

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
