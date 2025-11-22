"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { candidates } from "./mock-data";

export default function DetailDrawer({
  candidateId,
  open,
  setOpen,
}: {
  candidateId: string | null;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const candidate = candidates.find((c) => c.id === candidateId) || null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl bg-card text-card-foreground border-border">
        {candidate ? (
          <div className="w-full">
            <DialogHeader>
              <DialogTitle>{candidate.name}</DialogTitle>
              <DialogDescription>
                Fit Score: {candidate.fitScore}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2 text-sm text-muted-foreground">
              {candidate.location && <div>Location: {candidate.location}</div>}
              {candidate.experienceMonths !== undefined && (
                <div>Experience: {candidate.experienceMonths} months</div>
              )}
            </div>
            <Separator className="my-3" />
            <section>
              <h3 className="font-medium">Skill Evidence</h3>
              <ul className="mt-2 list-disc pl-4 text-sm">
                {candidate.matchedSkills.map((s) => (
                  <li key={s.skill}>{s.skill} — evidence excerpt...</li>
                ))}
              </ul>
            </section>
          </div>
        ) : (
          <div>Choose a candidate</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
