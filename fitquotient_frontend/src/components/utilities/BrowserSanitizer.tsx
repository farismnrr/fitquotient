"use client";

import { useEffect } from "react";

export default function BrowserSanitizer() {
  useEffect(() => {
    try {
      const docEl = document.documentElement;
      const attrs = Array.from(docEl.attributes || []);
      attrs.forEach((a) => {
        const name = (a && a.name) || "";
        if (name.startsWith("data-jetski-")) {
          docEl.removeAttribute(name);
        }
      });
    } catch {
      // Swallow DOM access errors in server or restricted environments
    }
  }, []);

  return null;
}
