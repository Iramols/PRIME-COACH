import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Standaard 1 MB is te klein voor een foto-upload (bv. telefoonfoto's).
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
