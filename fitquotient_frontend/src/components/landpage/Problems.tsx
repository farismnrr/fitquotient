import React from "react";

export default function Problems() {
  return (
    <section id="problems" className="py-16 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900">The problem</h2>
        <p className="mt-4 text-slate-700">
          Recruiting teams face high CV volumes, slow early-stage filtering,
          inconsistent evaluation and weak insights. FitQuotient automates and
          standardizes the early evaluation process to remove bias and speed
          decisions.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
            "High CV Volume",
            "Skill Signal Extraction",
            "Inconsistent Evaluation",
            "Slow Early-Stage Filtering",
            "Lack of Clear Insights",
          ].map((p) => (
            <div
              key={p}
              className="rounded-lg border bg-slate-100 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">{p}</h3>
              <p className="mt-2 text-slate-600">
                {/* Minimal explanation for each problem */}
                {p === "High CV Volume" &&
                  "Automate early filtering so recruiters focus on next-best actions."}
                {p === "Skill Signal Extraction" &&
                  "Extract built-from-CV skills, tools and achievements quickly."}
                {p === "Inconsistent Evaluation" &&
                  "Standardize scoring to reduce bias and maintain fairness."}
                {p === "Slow Early-Stage Filtering" &&
                  "Shorten time-to-hire by surfacing top candidates earlier."}
                {p === "Lack of Clear Insights" &&
                  "Clear, explainable reasoning helps justify candidate choices."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
