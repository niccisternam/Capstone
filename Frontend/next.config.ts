import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Fija la raíz del workspace en esta carpeta para que Next no la infiera
  // desde lockfiles presentes en directorios superiores (raíz del monorepo).
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    const backendOrigin =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
      "http://localhost:3000";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
