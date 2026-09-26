import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // The TypeScript CLI exits before flushing captured output under this Node
  // runtime. Use Next's compiler API for production type checking instead.
  experimental: {
    useTypeScriptCli: false,
  },
};

export default nextConfig;
