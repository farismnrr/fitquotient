import React from "react";
import { Button } from "@/components/ui/button";

interface CTAProps {
  onRegister?: () => void;
}

export default function CTA({ onRegister }: CTAProps) {
  return (
    <section className="bg-slate-50 py-12">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 text-center">
        <h3 className="text-xl font-semibold text-slate-900">
          Ready to remove guesswork from screening?
        </h3>
        <p className="mt-2 text-slate-700">
          Get started and see the FitQuotient fit score in action.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button size="lg" onClick={onRegister}>
            Get started
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-slate-50 text-slate-900 hover:bg-slate-100"
          >
            Contact sales
          </Button>
        </div>
      </div>
    </section>
  );
}
