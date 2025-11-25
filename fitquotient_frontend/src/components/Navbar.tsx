"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Menu } from "lucide-react";

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
    <header className="bg-background border-b border-border pt-[calc(env(safe-area-inset-top)+1rem)] sm:pt-[calc(env(safe-area-inset-top)+1.25rem)] md:pt-[calc(env(safe-area-inset-top)+1.5rem)] lg:pt-[calc(env(safe-area-inset-top)+2rem)] py-3 z-30 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-lg font-bold text-foreground flex items-center gap-2"
          >
            <Image
              src="/logo.svg"
              alt="FitQuotient logo"
              width={160}
              height={40}
              className="h-8 sm:h-10 w-auto"
            />
            <span className="hidden sm:inline">FitQuotient</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-4" role="navigation">
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
            className="hidden bg-background lg:block w-64 text-foreground"
          />
          <Link href="/dashboard/cv">
            <Button variant="default">Upload CV</Button>
          </Link>
          <Button
            variant="outline"
            className="hidden lg:inline-block bg-background text-foreground"
          >
            Connect ATS
          </Button>
          {/* Mobile menu trigger */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="left-0 top-0 translate-x-0 translate-y-0 w-full h-full sm:rounded-none lg:hidden overflow-auto pt-[calc(env(safe-area-inset-top)+1rem)] sm:pt-[calc(env(safe-area-inset-top)+1.25rem)]">
              <DialogTitle className="sr-only">Navigation menu</DialogTitle>
              <DialogDescription className="sr-only">
                Main navigation for the FitQuotient dashboard
              </DialogDescription>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <DialogClose asChild>
                    <Link
                      href="/"
                      className="text-lg font-bold text-foreground flex items-center gap-2"
                    >
                      <Image
                        src="/logo.svg"
                        alt="FitQuotient logo"
                        width={160}
                        height={40}
                        className="h-8 w-auto"
                      />
                      <span>FitQuotient</span>
                    </Link>
                  </DialogClose>
                </div>

                <nav className="flex flex-col gap-3" role="navigation">
                  {[
                    { href: "/dashboard", label: "Overview" },
                    { href: "/dashboard/jobs", label: "Jobs" },
                    { href: "/dashboard/cv", label: "CVs" },
                    { href: "/dashboard/settings/llm", label: "Settings" },
                  ].map((item) => {
                    const active = isActive(item.href);
                    const base =
                      "text-lg text-foreground w-full text-left pl-3 py-3 rounded-md hover:bg-muted";
                    const activeClasses = "font-semibold";
                    return (
                      <DialogClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={`${base} ${active ? activeClasses : ""}`}
                          aria-current={active ? "page" : undefined}
                        >
                          {item.label}
                        </Link>
                      </DialogClose>
                    );
                  })}
                </nav>

                <div className="flex flex-col gap-2">
                  <DialogClose asChild>
                    <Link href="/dashboard/cv">
                      <Button className="w-full">Upload CV</Button>
                    </Link>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="outline" className="w-full">
                      Connect ATS
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
