/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  async rewrites() {
    return [
      { source: '/core', destination: '/' },
      { source: '/forest', destination: '/' },
      { source: '/field', destination: '/' },
      { source: '/assets/:path*', destination: 'https://lusion.co/assets/:path*' },
    ];
  },
};

export default nextConfig;
