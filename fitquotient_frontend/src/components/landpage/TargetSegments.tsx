import React from "react";

const segments = [
  { name: "Recruitment Teams", desc: "Speed up screening and reduce workload" },
  {
    name: "Hiring Managers",
    desc: "Get clarity and data-driven recommendations",
  },
  {
    name: "HR Departments",
    desc: "Standardize evaluation across organization",
  },
  {
    name: "Staffing Agencies",
    desc: "Process large candidate volumes efficiently",
  },
  { name: "Internal Mobility", desc: "Evaluate employees for internal roles" },
];

export default function TargetSegments() {
  return (
    <section id="segments" className="bg-slate-50 py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900">Target Segments</h2>
        <p className="mt-2 text-slate-700">Who benefits from FitQuotient</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {segments.map((s) => (
            <div
              key={s.name}
              className="rounded-md border p-4 bg-slate-100 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">{s.name}</h3>
              <p className="mt-1 text-sm text-slate-700">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
