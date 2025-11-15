import React from "react";
import { Badge } from "@/components/ui/badge";

export default function UVP() {
  return (
    <section id="uvp" className="py-16 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Unique Value Proposition
        </h2>
        <p className="mt-4 text-slate-700">
          Built for modern hiring teams that need fast, explainable, and
          consistent talent evaluation at volume.
        </p>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-start">
          <div className="flex-1">
            <Badge>Explainable</Badge>
            <h3 className="mt-3 text-lg font-semibold text-slate-900">
              Explainable Talent Evaluation
            </h3>
            <p className="mt-2 text-slate-600">
              Every recommendation comes with clear backing and insights.
            </p>
          </div>

          <div className="flex-1">
            <Badge>Consistent</Badge>
            <h3 className="mt-3 text-lg font-semibold text-slate-900">
              Standardized Scoring
            </h3>
            <p className="mt-2 text-slate-600">
              Same evaluation criteria for all candidates to reduce bias.
            </p>
          </div>

          <div className="flex-1">
            <Badge>Fast</Badge>
            <h3 className="mt-3 text-lg font-semibold text-slate-900">
              Time-to-Insight
            </h3>
            <p className="mt-2 text-slate-600">
              Insights in seconds, enabling faster decision cycles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
