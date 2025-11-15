import React from "react";

export default function Footer() {
  return (
    <footer className="border-t bg-slate-50 py-8">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            © {new Date().getFullYear()} FitQuotient
          </div>
          <nav className="flex gap-4 text-sm text-slate-600">
            <a href="#" className="hover:text-slate-900">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-900">
              Terms
            </a>
            <a href="#" className="hover:text-slate-900">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
