// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 🚫 Build sırasında lint hatalarını yoksay
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 🚫 Build sırasında TypeScript hatalarını yoksay
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
