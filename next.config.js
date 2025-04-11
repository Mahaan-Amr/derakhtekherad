/** @type {import('next').NextConfig} */
const nextConfig = {
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
    domains: ['localhost'], // Legacy config for development - prefer remotePatterns for production
    unoptimized: true, // Disable Next.js image optimization to fix path resolution issues
    dangerouslyAllowSVG: true, // Allow SVG for placeholder images
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
};

module.exports = nextConfig;
