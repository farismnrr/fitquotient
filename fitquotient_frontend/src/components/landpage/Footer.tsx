import React from "react";
import Image from "next/image";
import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <section className="py-12 bg-background">
      <div className="max-w-5xl mx-auto px-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/logo.svg"
            alt="FitQuotient logo"
            width={160}
            height={40}
            className="h-10 w-auto"
          />
        </div>

        {/* Description */}
        <p className="mt-5 text-center text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl mx-auto">
          FitQuotient is an applicant tracking & candidate experience platform
          that connects modern recruiters and job seekers. Build professional
          CVs, discover relevant job listings, and utilize AI and analytics
          tools to improve hiring outcomes.
        </p>

        {/* Bottom row: icons (centered) */}
        <div className="mt-8 flex flex-col items-center gap-4 md:flex-row md:justify-center">
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="Github"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-foreground text-background hover:bg-primary transition"
            >
              <Github className="w-4 h-4" />
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-foreground text-background hover:bg-primary transition"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <hr className="mt-10 mb-6 border-border" />

        {/* Copyright */}
        <p className="text-xs sm:text-sm text-center text-muted-foreground">
          © {new Date().getFullYear()} FitQuotient — All rights reserved.
        </p>
      </div>
    </section>
  );
}
