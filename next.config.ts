import type { NextConfig } from "next";
import { securityHeaders } from "./src/lib/security/headers";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async headers() {
    const headers = Object.entries(
      securityHeaders(isProd, isProd),
    ).map(([key, value]) => ({ key, value }));
    return [
      {
        source: "/:path*",
        headers,
      },
    ];
  },
};

export default nextConfig;
