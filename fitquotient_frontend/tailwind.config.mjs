/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary (blue) full range light -> dark
        primary: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6", // Accent / link / icon highlight
          600: "#2563EB", // Primary brand color
          700: "#1D4ED8", // Hover / strong button
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        // Slate (neutral) full range light -> dark — overridden to match user acceptance
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        // Status colors
        success: "#22C55E",
        warning: "#EAB308",
        danger: "#EF4444",
      },
    },
  },
  plugins: [],
};

export default config;
