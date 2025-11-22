import React from "react";
import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        {/* Logo */}
        <div className="flex justify-center">
          <img src="/logo.svg" alt="FitQuotient logo" className="h-10 w-auto" />
        </div>

        {/* Description */}
        <p className="mt-5 text-center text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl mx-auto">
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
              className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-800 text-white hover:bg-blue-600 transition"
            >
              <Github className="w-4 h-4" />
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-800 text-white hover:bg-blue-600 transition"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <hr className="mt-10 mb-6 border-gray-200" />

        {/* Copyright */}
        <p className="text-xs sm:text-sm text-center text-gray-500">
          © {new Date().getFullYear()} FitQuotient — All rights reserved.
        </p>
      </div>
    </section>
  );
}
