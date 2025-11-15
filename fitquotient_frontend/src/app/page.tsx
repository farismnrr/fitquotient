"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const handleRegister = () => {
    router.push("/register");
  };
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Hero onRegister={handleRegister} />
      <Problems />
      <Capabilities />
      <UVP />
      <UseCases />
      <TargetSegments />
      <Blueprint />
      <CTA onRegister={handleRegister} />
      <Footer />
    </main>
  );
}
