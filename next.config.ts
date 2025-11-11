import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
  domains: ["lh3.googleusercontent.com", "plus.unsplash.com"]
 },
 devIndicators: false,
 experimental: {
    turbopackFileSystemCacheForDev: true,
 }
};

export default nextConfig;
