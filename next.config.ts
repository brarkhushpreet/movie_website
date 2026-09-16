import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // TMDB already provides resized images; no paid Cloudflare Images binding.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
};

export default nextConfig;
