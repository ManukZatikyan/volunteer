import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config to allow webpack config to work
  turbopack: {},
  
  webpack(config) {
    // Find the existing rule that handles SVG imports
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.('.svg')
    );

    // Modify the file loader rule to ignore SVGs
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    // Add a new rule to handle SVGs with @svgr/webpack
    // Remove issuer condition to match all SVG imports
    config.module.rules.push({
      test: /\.svg$/i,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
