import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/interval-timer" : "",
  assetPrefix: isProd ? "/interval-timer/" : "",
  images: { unoptimized: true },
};

export default nextConfig;
