import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Ignore README and other markdown files that shouldn't be imported
    config.module.rules.push({
      test: /\.md$/,
      type: "asset/source",
    });

    // Ignore problematic files from libsql packages
    if (!config.resolve) {
      config.resolve = {};
    }
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }

    // Prevent webpack from trying to parse README files as modules
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    // Add ignore pattern for markdown files in node_modules
    if (!config.module) {
      config.module = { rules: [] };
    }

    return config;
  },
  // Exclude libsql packages from server-side bundling issues
  serverExternalPackages: ["@libsql/client", "@prisma/adapter-libsql"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "credible-sharing-b61c46eae9.media.strapiapp.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
