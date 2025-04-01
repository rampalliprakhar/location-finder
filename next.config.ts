import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['react-leaflet'],
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://location-finder-two.vercel.app/'
  }
};

export default nextConfig;