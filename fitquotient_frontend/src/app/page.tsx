"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/landpage/Hero";
import Feature from "@/components/landpage/Feature";
import Footer from "@/components/landpage/Footer";

export default function Page() {
  const router = useRouter();

  const handleRegister = () => {
    router.push("/register");
  };
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero onRegister={handleRegister} />
      <Feature />
      <Footer />
    </main>
  );
}
