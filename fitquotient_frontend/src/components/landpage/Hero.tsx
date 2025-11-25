import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface HeroProps {
  onRegister?: () => void;
}

export default function Hero({ onRegister }: HeroProps) {
  return (
    <div className="bg-background">
      <header className="relative z-10 py-4 md:py-6">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between">
            <div className="shrink-0">
              <Link
                href="/"
                title="FitQuotient"
                className="flex rounded outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
              >
                <Image
                  className="w-auto h-10"
                  src="/logo.svg"
                  alt="FitQuotient"
                  width={160}
                  height={40}
                />
              </Link>
            </div>

            {/* Mobile Menu Button using Dialog primitive */}
            <div className="flex md:hidden">
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="text-foreground"
                    aria-label="Open menu"
                  >
                    <Menu className="w-7 h-7" />
                  </button>
                </DialogTrigger>

                <DialogContent className="left-0 top-0 translate-x-0 translate-y-0 w-full h-full sm:rounded-none md:hidden overflow-auto pt-[calc(env(safe-area-inset-top)+1rem)] sm:pt-[calc(env(safe-area-inset-top)+1.25rem)]">
                  <DialogTitle className="sr-only">
                    Primary navigation
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    Open navigation menu
                  </DialogDescription>
                  <nav className="px-4 py-6">
                    <div className="grid gap-y-4">
                      <DialogClose asChild>
                        <Link href="#features" className="text-lg py-3">
                          Features
                        </Link>
                      </DialogClose>
                      <DialogClose asChild>
                        <Link href="#pricing" className="text-lg py-3">
                          Pricing
                        </Link>
                      </DialogClose>
                      <DialogClose asChild>
                        <Link href="#contact" className="text-lg py-3">
                          Contact
                        </Link>
                      </DialogClose>
                    </div>
                    <div className="mt-6">
                      <DialogClose asChild>
                        <Button onClick={onRegister} className="w-full">
                          Get started
                        </Button>
                      </DialogClose>
                    </div>
                  </nav>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:pb-24">
        <div className="absolute bottom-0 right-0 overflow-hidden">
          <Image
            className="w-full h-auto origin-bottom-right transform scale-150 lg:w-auto lg:mx-auto lg:object-cover lg:scale-75 opacity-30 blur-[1px]"
            src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/1/background-pattern.png"
            alt="Background pattern"
            width={1024}
            height={768}
          />
        </div>

        <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-y-4 lg:items-center lg:grid-cols-2 xl:grid-cols-2">
            <div className="text-center xl:col-span-1 lg:text-left md:px-16 lg:px-0 xl:pr-20">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight font-pj max-w-2xl mx-auto lg:mx-0">
                FitQuotient — Talent Intelligence Engine
              </h1>

              <p className="mt-2 text-lg text-muted-foreground sm:mt-6 font-inter">
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
              <Image
                className="w-full mx-auto"
                src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/1/illustration.png"
                alt="Hero illustration"
                width={900}
                height={600}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
