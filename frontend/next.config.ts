import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Skip ESLint checks during build to avoid slow/blocked builds on constrained machines
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Encoding ve charset ayarları
  generateEtags: false,
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
