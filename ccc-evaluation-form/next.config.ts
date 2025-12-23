import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  
  // This replaces the old experimental tracing option
  serverExternalPackages: ["@prisma/client"],

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['recharts', 'lucide-react', 'framer-motion'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;