"use client";

import React, { useEffect, useState } from "react";
import type { CV } from "./CVForm";
import { useAuthStore } from "@/store/authStore";
import { getUserCvs } from "@/lib/api/dashboard/cv/getUserCvs";
import { buildCoreUrl, getAccessToken } from "@/lib/api/withAuth";
import { handleApiCall } from "@/lib/api-handler";
import type { RawCV } from "@/lib/api/dashboard/cv/getUserCvs";

function mapRawCvToUI(cv: RawCV): CV {
  return {
    id: cv.id,
    name: cv.name || cv.filename || "CV",
    filename: cv.filename || undefined,
    fileType: cv.mime_type || undefined,
    fileData: cv.url || null,
    text: undefined,
  };
}

export default function CVList() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useAuthStore((s) => s.getAccessToken());

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      if (!accessToken) {
        return;
      }

      const res = await handleApiCall(() => getUserCvs(), {
        onSuccess: (data) => {
          setCvs((data?.cvs || []).map(mapRawCvToUI));
        },
        onError: (message) => {
          setCvs([]);
          setError(message);
        },
        showSuccessToast: false,
      });

      if (!mounted) return;

      if (!res.success) {
        setError(res.message || "Failed to fetch CVs");
      }

      setLoading(false);
    }

    load();

    return () => {
      mounted = false;
    };
  }, [accessToken]);

  if (loading)
    return <div className="text-sm text-muted-foreground">Loading CVs...</div>;
  if (error)
    return (
      <div className="text-sm text-destructive">
        Failed to load CVs: {error}
      </div>
    );
  if (!cvs.length)
    return <div className="text-sm text-muted-foreground">No CVs uploaded</div>;

  return (
    <div className="space-y-3">
      {cvs.map((c) => (
        <div key={c.id} className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-card-foreground">
                {c.name}
              </h4>
              <div className="text-sm text-muted-foreground">
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
            <div className="text-sm text-muted-foreground text-right">
              <div>{c.id}</div>
              {c.fileData &&
                (() => {
                  // If fileData is a data URL, we can use a normal anchor to
                  // trigger downloads (data URLs are small enough and don't need
                  // additional auth headers).
                  if (c.fileData?.startsWith("data:")) {
                    return (
                      <a
                        href={c.fileData}
                        download={c.filename || c.name}
                        className="text-sm text-primary hover:underline"
                      >
                        Download
                      </a>
                    );
                  }

                  // Compute a public HTTP(S) URL for uploads/core-stored paths.
                  const downloadUrl = (() => {
                    try {
                      if (c.fileData.startsWith("file://")) {
                        const path = c.fileData.replace(/^file:\/+/, "");
                        return buildCoreUrl(`/${path}`);
                      }
                      if (/^uploads\//i.test(c.fileData))
                        return buildCoreUrl(`/${c.fileData}`);
                      return c.fileData;
                    } catch {
                      return c.fileData;
                    }
                  })();

                  async function handleDownload(e: React.MouseEvent) {
                    e.preventDefault();
                    if (!downloadUrl) return;
                    try {
                      // Attach Authorization header for protected endpoints.
                      const token = getAccessToken();
                      const headersObj = new Headers();
                      if (token)
                        headersObj.set("Authorization", `Bearer ${token}`);
                      const res = await fetch(downloadUrl, {
                        headers: headersObj,
                      });
                      if (!res.ok)
                        throw new Error(
                          res.statusText || "Failed to download file"
                        );
                      const blob = await res.blob();
                      const blobUrl = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = blobUrl;
                      a.download = c.filename || c.name || "download";
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      window.URL.revokeObjectURL(blobUrl);
                    } catch {
                      // Silent error handling
                    }
                  }

                  return (
                    <button
                      onClick={handleDownload}
                      className="text-sm text-primary hover:underline"
                    >
                      Download
                    </button>
                  );
                })()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
