import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["digitalflake-backend-7yzm.onrender.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
