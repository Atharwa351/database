/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['undici'],
  serverComponentsExternalPackages: ['undici', '@elastic/elasticsearch'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
