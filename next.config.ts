import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/interval-timer",
  assetPrefix: "/interval-timer/",
  images: { unoptimized: true },
};

export default nextConfig;
