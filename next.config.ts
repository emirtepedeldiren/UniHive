import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable instrumentation hook (src/instrumentation.ts)
  experimental: {
    instrumentationHook: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
