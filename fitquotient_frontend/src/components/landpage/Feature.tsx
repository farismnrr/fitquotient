import React from "react";
import {
  ScanSearch,
  Workflow,
  BarChart3,
  UsersRound,
  FileCheck2,
  PieChart,
} from "lucide-react";

const features = [
  {
    title: "Recruitment Screening",
    desc: "Automate early filtering and identify top candidates faster.",
    icon: <ScanSearch className="w-10 h-10 stroke-[2.2]" />,
  },
  {
    title: "Technical Role Evaluation",
    desc: "Detect toolsets, frameworks, and project relevance for technical hires.",
    icon: <Workflow className="w-10 h-10 stroke-[2.2]" />,
  },
  {
    title: "Multi-Candidate Comparison",
    desc: "Evaluate several candidates in parallel with unified scoring.",
    icon: <BarChart3 className="w-10 h-10 stroke-[2.2]" />,
  },
  {
    title: "Talent Pool Scanning",
    desc: "Re-evaluate CV pools against new job descriptions quickly.",
    icon: <UsersRound className="w-10 h-10 stroke-[2.2]" />,
  },
  {
    title: "JD Quality Assurance",
    desc: "Ensure job descriptions are specific and aligned to hiring requirements.",
    icon: <FileCheck2 className="w-10 h-10 stroke-[2.2]" />,
  },
  {
    title: "Manager Insights",
    desc: "Provide hiring managers with concise, data-driven summaries per candidate.",
    icon: <PieChart className="w-10 h-10 stroke-[2.2]" />,
  },
];

export default function Feature() {
  return (
    <section id="features" className="py-12 bg-slate-50 sm:py-16 lg:py-20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl xl:text-5xl font-pj">
            Make every step user-centric
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:mt-8 font-pj">
            AI-assisted workflows to help hiring teams sift, score and decide
            faster — with consistency and human-centric explainability.
          </p>
        </div>

        <div className="grid grid-cols-1 mt-10 text-center sm:mt-20 sm:grid-cols-2 sm:gap-x-8 gap-y-8 md:grid-cols-3 xl:mt-24">
          {features.map((f) => (
            <div
              key={f.title}
              className="group bg-card rounded-2xl border border-neutral-200 p-8 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 hover:bg-white flex flex-col items-center text-left"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground font-pj w-full">
                {f.title}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground font-pj w-full">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
