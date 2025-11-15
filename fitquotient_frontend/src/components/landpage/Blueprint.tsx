import React from "react";

const tech = [
  "Embeddings for semantic similarity",
  "LLMs for reasoning and summarization",
  "Skill extraction models",
  "Vector DB for matching",
  "CV parsing pipeline",
  "Candidate evaluation & ranking logic",
];

export default function Blueprint() {
  return (
    <section id="blueprint" className="py-16 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900">
          High-Level Technical Blueprint
        </h2>
        <p className="mt-2 text-slate-700">
          A condensed overview of the FitQuotient architecture
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {tech.map((t) => (
            <div
              key={t}
              className="rounded-md border p-4 bg-slate-100 shadow-sm"
            >
              <h3 className="text-sm font-semibold text-slate-800">{t}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
