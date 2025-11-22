import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface HeroProps {
  onRegister?: () => void;
}

export default function Hero({ onRegister }: HeroProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-50">
      <header className="relative z-10 py-4 md:py-6">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between">
            <div className="shrink-0">
              <Link
                href="/"
                title="FitQuotient"
                className="flex rounded outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
              >
                <img
                  className="w-auto h-10"
                  src="/logo.svg"
                  alt="FitQuotient"
                />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                type="button"
                className="text-gray-900"
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
              >
                {!expanded ? (
                  <Menu className="w-7 h-7" />
                ) : (
                  <X className="w-7 h-7" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:pb-24">
        <div className="absolute bottom-0 right-0 overflow-hidden">
          <img
            className="w-full h-auto origin-bottom-right transform scale-150 lg:w-auto lg:mx-auto lg:object-cover lg:scale-75 opacity-30 blur-[1px]"
            src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/1/background-pattern.png"
            alt="Background pattern"
          />
        </div>

        <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-y-4 lg:items-center lg:grid-cols-2 xl:grid-cols-2">
            <div className="text-center xl:col-span-1 lg:text-left md:px-16 lg:px-0 xl:pr-20">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight font-pj max-w-2xl mx-auto lg:mx-0">
                FitQuotient — Talent Intelligence Engine
              </h1>

              <p className="mt-2 text-lg text-gray-600 sm:mt-6 font-inter">
                AI-powered candidate evaluation that delivers explainable fit
                scores, skill mapping and gap analysis — so hiring teams move
                faster with clarity and consistency.
              </p>

              <div className="mt-10 flex items-center justify-center lg:justify-start">
                <Button
                  className="inline-flex px-8 py-6 text-lg font-semibold text-white transition-all duration-200 bg-primary rounded-2xl! font-pj hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600"
                  onClick={onRegister}
                >
                  Get started
                </Button>
              </div>
            </div>

            <div className="xl:col-span-1">
              <img
                className="w-full mx-auto"
                src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/1/illustration.png"
                alt="Hero illustration"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
