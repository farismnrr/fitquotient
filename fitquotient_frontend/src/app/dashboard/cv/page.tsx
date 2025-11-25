"use client";

import CVForm from "@/components/dashboard/cv/CVForm";
import CVList from "@/components/dashboard/cv/CVList";
// No filters for CVs page — keep the Add CV modal on the top-right
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function CVPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [version, setVersion] = useState(0);
  return (
    <main className="min-h-screen bg-background text-foreground py-8">
      <div className="mx-auto max-w-7xl px-6">
        {/* Navbar provided globally in layout */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold mb-4">CVs</h2>
          <div className="flex items-center gap-2">
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button>Add CV</Button>
              </DialogTrigger>
              <DialogContent className="bg-card text-card-foreground border-border">
                <DialogHeader className="px-6 pt-6">
                  <DialogTitle>Add CV</DialogTitle>
                </DialogHeader>
                <div className="h-[min(80vh,720px)] w-full">
                  <CVForm
                    onAdd={() => {
                      setVersion((v) => v + 1);
                      setAddOpen(false);
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <section className="mt-4">
          <CVList key={version} />
        </section>
      </div>
    </main>
  );
}
