import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "https://localhost:8443",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "plus.unsplash.com",
      "img.freepik.com",
      "images.pexels.com",
      "images.unsplash.com",
      "unsplash.com",
    ],
  },
  devIndicators: false,
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
