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
  // Pages dizinini src/pages olarak ayarla
  pageExtensions: ["tsx", "ts", "jsx", "js"],
};

export default nextConfig;
