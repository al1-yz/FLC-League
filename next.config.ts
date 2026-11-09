import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the e2e server run beside a regular `npm run dev` without sharing build output.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
