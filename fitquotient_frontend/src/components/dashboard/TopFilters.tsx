"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TopFilters({
  onApply,
}: {
  onApply: (
    filters: {
      skill?: string;
      location?: string;
      minExperience?: number;
    } | null
  ) => void;
}) {
  const available = ["skill", "location", "minExperience"] as const;

  const [selected, setSelected] = useState<(typeof available)[number]>(
    available[0]
  );

  const [filters, setFilters] = useState<
    Array<{
      id: string;
      type: "skill" | "location" | "minExperience";
      value: string;
    }>
  >([]);

  const addFilter = () => {
    // Prevent adding the same filter type multiple times
    if (activeTypes.includes(selected)) return;

    setFilters((prev) => [
      ...prev,
      { id: String(Date.now()), type: selected, value: "" },
    ]);

    // auto-select next available type
    const after = available.find(
      (a) => a !== selected && !activeTypes.includes(a)
    );
    setSelected(
      after ?? available.find((a) => !activeTypes.includes(a)) ?? available[0]
    );
  };

  const removeFilter = (id: string) => {
    const removed = filters.find((f) => f.id === id);
    setFilters((prev) => prev.filter((f) => f.id !== id));
    // auto-select the removed type so users can re-add quickly
    if (removed) setSelected(removed.type);
  };

  const updateFilter = (id: string, value: string) => {
    setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)));
  };

  const apply = () => {
    if (filters.length === 0) return onApply(null);
    const res: { skill?: string; location?: string; minExperience?: number } =
      {};
    filters.forEach((f) => {
      if (f.type === "skill") {
        const v = f.value.trim();
        if (v) res.skill = v;
      }
      if (f.type === "location") {
        const v = f.value.trim();
        if (v) res.location = v;
      }
      if (f.type === "minExperience") {
        const n = parseInt(f.value, 10);
        if (!Number.isNaN(n)) res.minExperience = n;
      }
    });

    onApply(Object.keys(res).length > 0 ? res : null);
  };

  const reset = () => {
    setFilters([]);
    onApply(null);
    setSelected(available[0]);
  };

  const activeTypes = filters.map((f) => f.type);

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Label className="hidden md:block">Add filter</Label>
          <select
            value={selected}
            onChange={(e) =>
              setSelected(e.target.value as (typeof available)[number])
            }
            className="rounded border px-2 py-1"
          >
            {available.map((a) => (
              <option key={a} value={a} disabled={activeTypes.includes(a)}>
                {a === "skill"
                  ? "Skill"
                  : a === "location"
                  ? "Location"
                  : "Min experience"}
              </option>
            ))}
          </select>
          <Button onClick={addFilter} disabled={activeTypes.includes(selected)}>
            Add
          </Button>
        </div>

        <div className="md:flex-1" />

        <div className="flex items-center gap-2 justify-end">
          <Button variant="ghost" onClick={reset}>
            Reset
          </Button>
          <Button onClick={apply}>Apply</Button>
        </div>
      </div>

      {filters.length > 0 && (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filters.map((f) => (
            <div key={f.id} className="flex items-center gap-2">
              <Label className="min-w-24">
                {f.type === "skill"
                  ? "Skill"
                  : f.type === "location"
                  ? "Location"
                  : "Min experience (months)"}
              </Label>

              {f.type === "minExperience" ? (
                <Input
                  type="number"
                  placeholder="e.g. 36"
                  value={f.value}
                  onChange={(e) => updateFilter(f.id, e.target.value)}
                />
              ) : (
                <Input
                  placeholder={
                    f.type === "skill" ? "Skill (e.g. React)" : "Location"
                  }
                  value={f.value}
                  onChange={(e) => updateFilter(f.id, e.target.value)}
                />
              )}

              <Button variant="ghost" onClick={() => removeFilter(f.id)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
