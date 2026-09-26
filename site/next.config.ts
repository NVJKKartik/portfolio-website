import type { NextConfig } from 'next';

// Static export: the whole site is prebuilt HTML, deployable to Netlify or any static host.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // This app lives in site/ inside a repo that also holds the legacy template; pin the root.
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
