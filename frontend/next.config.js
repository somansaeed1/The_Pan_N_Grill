const path = require('path');

// Docker build: a self-contained server output (BUILD_STANDALONE=1) and a proxy that
// forwards /api requests to the backend container (BACKEND_URL). Both are off by
// default, so Vercel and local development build exactly as before.
const standalone = process.env.BUILD_STANDALONE === '1';
const backendUrl = (process.env.BACKEND_URL || '').replace(/\/$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  ...(standalone && {
    output: 'standalone',
    outputFileTracingRoot: path.join(__dirname, '..'),
  }),
  async rewrites() {
    return backendUrl ? [{ source: '/api/:path*', destination: `${backendUrl}/api/:path*` }] : [];
  },
};

module.exports = nextConfig;
