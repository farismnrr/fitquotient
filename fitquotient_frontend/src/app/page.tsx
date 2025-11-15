import React from "react";
import Hero from "@/components/landpage/Hero";
import Problems from "@/components/landpage/Problems";
import Capabilities from "@/components/landpage/Capabilities";
import UVP from "@/components/landpage/UVP";
import UseCases from "@/components/landpage/UseCases";
import TargetSegments from "@/components/landpage/TargetSegments";
import Blueprint from "@/components/landpage/Blueprint";
import CTA from "@/components/landpage/CTA";
import Footer from "@/components/landpage/Footer";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Hero />
      <Problems />
      <Capabilities />
      <UVP />
      <UseCases />
      <TargetSegments />
      <Blueprint />
      <CTA />
      <Footer />
    </main>
  );
}
