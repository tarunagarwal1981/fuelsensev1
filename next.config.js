/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Output configuration for static export (if needed)
  // output: 'standalone', // Uncomment for standalone deployment

  // Environment variables that should be available on the client
  env: {
    APP_NAME: 'Fuel Sense',
    APP_VERSION: '0.1.0',
  },

  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Experimental features (if needed)
  experimental: {
    // Enable if using server actions
    // serverActions: true,
  },
}

module.exports = nextConfig

