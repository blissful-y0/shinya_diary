import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 배포를 위한 설정
  images: {
    // Cloudflare Pages에서는 next/image 최적화 제한
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shinyacal.shop",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
