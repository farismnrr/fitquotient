"use client";

export default function AnalyticsRow() {
  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap gap-4">
        <div className="rounded border border-slate-200 p-4 bg-white">
          # processed: <strong>134</strong>
        </div>
        <div className="rounded border border-slate-200 p-4 bg-white">
          Average Fit Score: <strong>78</strong>
        </div>
        <div className="rounded border border-slate-200 p-4 bg-white">
          Top missing skills
        </div>
      </div>
    </div>
  );
}
