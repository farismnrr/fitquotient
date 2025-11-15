import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-linear-to-b from-primary-50/60 to-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            FitQuotient — Talent Intelligence Engine
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-700">
            AI-powered candidate evaluation that delivers explainable fit
            scores, skill mapping and gap analysis — so hiring teams move faster
            with clarity and consistency.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button asChild className="px-6" size="lg">
              <Link href="/register">Get started</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-slate-50 text-slate-900 hover:bg-slate-100"
            >
              Learn more
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
