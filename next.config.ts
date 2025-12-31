import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React StrictMode 비활성화 (개발환경 API 중복 호출 방지)
  reactStrictMode: false,
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
  // styled-components SSR 지원
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
