/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.builder.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.cloud.google.com',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
  },
  transpilePackages: ['@uiw/react-codemirror', '@uiw/codemirror-extensions-basic-setup'],
  // For Next.js 15+, use the new webpack configuration format
  webpack: (config, { dev }) => {
    // Add SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    if (dev) {
      config.watchOptions = {
        ignored: '**/node_modules/**',
        poll: 1000,
      };
    }
    return config;
  },
  webpack: (config, { isServer }) => {
    // Fix for dynamic imports
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  // Add this for the CORS issue you were seeing
  allowedDevOrigins: ['questify.dev'],
};

module.exports = nextConfig;
