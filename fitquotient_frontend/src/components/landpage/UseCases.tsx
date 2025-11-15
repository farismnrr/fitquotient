import React from "react";

export default function UseCases() {
  const cases = [
    {
      title: "Recruitment Screening",
      body: "Automate early filtering and identify top candidates faster.",
    },
    {
      title: "Technical Role Evaluation",
      body: "Detect toolsets, frameworks, and project relevance for technical hires.",
    },
    {
      title: "Multi-Candidate Comparison",
      body: "Evaluate several candidates in parallel with unified scoring.",
    },
    {
      title: "Talent Pool Scanning",
      body: "Re-evaluate CV pools against new job descriptions quickly.",
    },
    {
      title: "JD Quality Assurance",
      body: "Ensure job descriptions are specific and aligned to hiring requirements.",
    },
    {
      title: "Manager Insights",
      body: "Provide hiring managers with concise, data-driven summaries per candidate.",
    },
  ];

  return (
    <section id="usecases" className="py-16 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Business Use Cases
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {cases.map((c) => (
            <div key={c.title} className="rounded-md border p-4 shadow-sm">
              <h3 className="font-semibold text-slate-900">{c.title}</h3>
              <p className="mt-2 text-sm text-slate-700">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
