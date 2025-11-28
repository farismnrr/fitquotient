"use client";

import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | null;
  placeholder?: string;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select",
  disabled = false,
  className = "",
}: SelectProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [dropdownCss, setDropdownCss] = useState<{
    top?: number;
    bottom?: number;
    left?: number;
    width?: number;
    maxHeight?: number;
    transformOrigin?: string;
  }>({});

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      const target = e.target as Node;
      if (containerRef.current.contains(target)) return;
      if (dropdownRef.current) {
        try {
          if (dropdownRef.current.contains(target)) return;
        } catch {}
        const rect = dropdownRef.current.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          return;
        }
      }
      setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const selected = options.find((o) => o.value === value);
  const dropdownRef = useRef<HTMLUListElement | null>(null);

  // Recalculate dropdown position when open changes, on resize or scroll
  useEffect(() => {
    if (!open) return;
    function updatePosition() {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const width = Math.min(rect.width, viewportWidth - 16);
      let left = rect.left;
      if (left + width + 8 > viewportWidth) {
        left = Math.max(8, Math.min(left, viewportWidth - width - 8));
      }
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom - 8; // 8px padding
      const spaceAbove = rect.top - 8;
      // We'll try to render downwards. If not enough space, render upwards.
      const preferredMaxHeight = Math.floor(viewportHeight * 0.6); // cap at 60% viewport
      const maxHeightDown = Math.min(
        preferredMaxHeight,
        Math.max(spaceBelow, 0)
      );
      const maxHeightUp = Math.min(preferredMaxHeight, Math.max(spaceAbove, 0));
      if (spaceBelow >= 160 || spaceBelow >= spaceAbove) {
        // render down
        setDropdownCss({
          top: rect.bottom,
          left,
          width: width,
          maxHeight: maxHeightDown,
          transformOrigin: "top",
        });
      } else {
        // render up
        setDropdownCss({
          bottom: viewportHeight - rect.top,
          left,
          width: width,
          maxHeight: maxHeightUp,
          transformOrigin: "bottom",
        });
      }
    }
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        className={`w-full flex items-center justify-between gap-2 px-2 py-1 border rounded bg-white dark:bg-card text-sm ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
        onClick={() => !disabled && setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown size={16} />
      </button>

      {open &&
        !disabled &&
        (typeof document !== "undefined"
          ? createPortal(
              <ul
                role="listbox"
                aria-activedescendant={value ?? undefined}
                style={{
                  position: "fixed",
                  top: dropdownCss.top,
                  bottom: dropdownCss.bottom,
                  left: dropdownCss.left,
                  width: dropdownCss.width,
                  maxHeight: dropdownCss.maxHeight,
                  transformOrigin: dropdownCss.transformOrigin,
                  overflowY: "auto",
                }}
                className="z-9999 bg-white dark:bg-card border rounded shadow-lg overflow-y-auto text-sm pointer-events-auto"
                ref={dropdownRef}
                onMouseDown={(e) => e.stopPropagation()} // avoid immediate outside click close
                onWheel={(e) => e.stopPropagation()} // ensure scrolling the list doesn't bubble to page
              >
                {options.length === 0 && (
                  <li className="px-3 py-2 text-muted-foreground">
                    No options
                  </li>
                )}
                {options.map((o) => (
                  <li
                    key={o.value}
                    id={o.value}
                    role="option"
                    aria-selected={o.value === value}
                    className={`px-3 py-2 hover:bg-muted/30 cursor-pointer pointer-events-auto ${
                      o.value === value ? "bg-muted/40 font-medium" : ""
                    }`}
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                  >
                    {o.label}
                  </li>
                ))}
              </ul>,
              document.body
            )
          : null)}
    </div>
  );
}

export default Select;
