"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  return (
    <header className="bg-linear-to-br from-slate-50 to-slate-100 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-bold text-slate-900">
            FitQuotient
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-slate-700 hover:text-slate-900"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/jobs"
              className="text-sm text-slate-700 hover:text-slate-900"
            >
              Jobs
            </Link>
            <Link
              href="/dashboard/cv"
              className="text-sm text-slate-700 hover:text-slate-900"
            >
              CVs
            </Link>
            <Link
              href="/dashboard/settings/llm"
              className="text-sm text-slate-700 hover:text-slate-900"
            >
              Settings
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Cari job atau JD"
            className="hidden md:block w-64"
          />
          <Link href="/dashboard/cv">
            <Button variant="default">Upload CV</Button>
          </Link>
          <Button
            variant="outline"
            className="hidden md:inline-block bg-white text-slate-800"
          >
            Connect ATS
          </Button>
        </div>
      </div>
    </header>
  );
}
