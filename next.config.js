/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@flowlink/shared'],
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: '../..',
  },
}

module.exports = nextConfig

