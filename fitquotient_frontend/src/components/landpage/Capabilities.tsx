import React from "react";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    title: "Fit Score",
    body: "A measurable representation of candidate-to-role alignment with explainability.",
  },
  {
    title: "Skill Matching Engine",
    body: "Identifies matched skills, highlights gaps, and maps to JD requirements.",
  },
  {
    title: "Experience Relevancy",
    body: "Evaluates roles, responsibilities, achievements, and domain experience.",
  },
  {
    title: "Gap Analysis",
    body: "Shows competency gaps and recommended improvement areas.",
  },
  {
    title: "Candidate Ranking",
    body: "Rank multiple CVs by fit, relevancy, and overall alignment.",
  },
  {
    title: "AI Insight Summary",
    body: "Concise, readable explanations of strengths, weaknesses and concerns.",
  },
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="bg-slate-50 py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Core Capabilities
          </h2>
          <p className="mt-2 text-slate-600">What FitQuotient delivers</p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {features.map(({ title, body }) => (
            <div
              key={title}
              className="rounded-lg border border-transparent bg-slate-100 p-6 shadow"
            >
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-slate-600">{body}</p>
              <Separator className="my-4" />
              <p className="mt-2 text-xs text-slate-500">
                Explainable, fast, and role-centric.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
