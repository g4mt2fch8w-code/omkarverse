/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  async rewrites() {
    return [
      { source: '/core', destination: '/' },
      { source: '/telemetry', destination: '/' },
      { source: '/forest', destination: '/' },
      { source: '/tiger', destination: '/' },
      { source: '/field', destination: '/' },
    ];
  },
};

export default nextConfig;
