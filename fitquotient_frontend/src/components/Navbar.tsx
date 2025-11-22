"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (!pathname) return false;
    // Exact match for dashboard overview so it doesn't match subroutes.
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/dashboard/";
    }

    // For other links, match exact or nested pages (e.g. /dashboard/jobs/123)
    return pathname === href || pathname.startsWith(href + "/");
  };
  return (
    <header className="bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-lg font-bold text-foreground flex items-center gap-2"
          >
            <img
              src="/logo.svg"
              className="h-10 w-auto"
              alt="FitQuotient logo"
            />
            <span className="hidden sm:inline">FitQuotient</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            {[
              { href: "/dashboard", label: "Overview" },
              { href: "/dashboard/jobs", label: "Jobs" },
              { href: "/dashboard/cv", label: "CVs" },
              { href: "/dashboard/settings/llm", label: "Settings" },
            ].map((item) => {
              const active = isActive(item.href);
              const base =
                "text-sm text-muted-foreground hover:text-foreground";
              const activeClasses = "text-foreground font-semibold";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${base} ${active ? activeClasses : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Find Job or CV..."
            className="hidden bg-background md:block w-64 text-foreground"
          />
          <Link href="/dashboard/cv">
            <Button variant="default">Upload CV</Button>
          </Link>
          <Button
            variant="outline"
            className="hidden md:inline-block bg-background text-foreground"
          >
            Connect ATS
          </Button>
        </div>
      </div>
    </header>
  );
}
