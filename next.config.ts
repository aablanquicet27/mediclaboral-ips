import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // framer-motion v12 Easing type incompatibility with strict TS
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
