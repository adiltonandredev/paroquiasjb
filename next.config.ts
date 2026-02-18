import type { NextConfig } from "next";

const nextConfig = {
  // ... outras configurações que você já tenha ...
  
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
