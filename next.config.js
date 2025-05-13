/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    // Add proper configuration for locally uploaded images with detailed comments
    domains: ['derakhtekherad.com', 'localhost'],
    unoptimized: true,
    dangerouslyAllowSVG: true, // Allow SVG for placeholder images
    minimumCacheTTL: 0, // Disable image caching to ensure fresh images are loaded
  },
  // Add logging for image optimization to debug any issues
  onDemandEntries: {
    // Keep pages in memory for longer during development
    maxInactiveAge: 25 * 1000,
    // Track more pages in development for better debugging
    pagesBufferLength: 5,
  },
  // The bcrypt package should be used in ssr or edge functions
  transpilePackages: ["bcrypt"],
  basePath: '',
  // Configure static assets and uploaded files to be served properly
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*',
      },
    ];
  },
  // Disable response cache for API routes
  experimental: {
    serverComponentsExternalPackages: ['bcrypt', 'prisma', '@prisma/client'],
  },
  // Add explicit headers for static assets
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
        ],
      }
    ];
  },
  // Ensure static files are properly served
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  // Prevent stale cache
  generateEtags: false,
  // Force trailing slash for consistent paths
  trailingSlash: true,
  webpack(config) {
    return config;
  },
};

module.exports = nextConfig;
