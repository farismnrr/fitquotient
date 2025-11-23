"use client";

export default function AnalyticsRow() {
  return (
    <div className="mt-4 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap gap-4">
        <div className="rounded border border-border p-4 bg-card">
          # processed: <strong>134</strong>
        </div>
        <div className="rounded border border-border p-4 bg-card">
          Average Fit Score: <strong>78</strong>
        </div>
        <div className="rounded border border-border p-4 bg-card">
          Top missing skills
        </div>
      </div>
    </div>
  );
}
