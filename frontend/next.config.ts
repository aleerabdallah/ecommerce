import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "127.0.0.1",
      "localhost",
      "your-production-domain.com", // Add your production domain
    ],
    // Or use remotePatterns for better security
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
      {
        protocol: "https",
        hostname: "your-production-domain.com", // Add your production domain
      },
    ],
  },
};

module.exports = nextConfig;
export default nextConfig;
