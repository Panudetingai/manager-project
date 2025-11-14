import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
  domains: ["lh3.googleusercontent.com", "plus.unsplash.com", "img.freepik.com", "images.pexels.com"]
 },
 devIndicators: false,
 experimental: {
    turbopackFileSystemCacheForDev: false,
 }
};

export default nextConfig;
