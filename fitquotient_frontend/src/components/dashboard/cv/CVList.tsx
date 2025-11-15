"use client";

import React from "react";
import type { CV } from "./CVForm";

export default function CVList() {
  const cvs = JSON.parse(localStorage.getItem("cvs") || "[]") as CV[];

  if (!cvs.length)
    return <div className="text-sm text-slate-600">No CVs uploaded</div>;

  return (
    <div className="space-y-3">
      {cvs.map((c) => (
        <div
          key={c.id}
          className="rounded-lg border border-slate-200 bg-white p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-slate-900">{c.name}</h4>
              <div className="text-sm text-slate-600">
                {c.filename ? (
                  <>
                    <span className="font-medium">{c.filename}</span>
                    <span className="ml-2">{c.fileType || ""}</span>
                  </>
                ) : (
                  <>{(c.text || "").slice(0, 80)}...</>
                )}
              </div>
            </div>
            <div className="text-sm text-slate-500 text-right">
              <div>{c.id}</div>
              {c.fileData && (
                <a
                  href={c.fileData}
                  download={c.filename || c.name}
                  className="text-sm text-slate-600 hover:underline"
                >
                  Download
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
