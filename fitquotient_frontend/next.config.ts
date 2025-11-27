import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Expose the core API URL to the browser by mapping it to URL_CORE
  // This allows client-side code to access the value via process.env.URL_CORE
  env: {
    URL_CORE: process.env.URL_CORE ?? "",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.rareblocks.xyz",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
