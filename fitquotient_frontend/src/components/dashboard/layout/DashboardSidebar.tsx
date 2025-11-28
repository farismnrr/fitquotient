"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DashboardSidebar() {
  const [skill, setSkill] = useState("");

  return (
    <aside className="w-72 p-4 bg-card rounded-lg border border-border shadow-sm">
      <div className="space-y-4">
        <div>
          <Label className="text-foreground">Filters</Label>
          <div className="mt-2 space-y-2">
            <Input
              placeholder="Skill (e.g. React)"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />
            <Input placeholder="Location" />
            <Input placeholder="Min experience (months)" />
            <div className="flex items-center justify-between gap-2">
              <Button variant="ghost">Apply</Button>
              <Button variant="outline">Reset</Button>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-foreground">Saved filters</Label>
          <div className="mt-2 flex flex-col gap-2">
            <Button variant="secondary">Frontend Senior</Button>
            <Button variant="ghost">Remote Candidates</Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
