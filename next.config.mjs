/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLint config is not included in this starter; skip lint during CI builds.
  eslint: { ignoreDuringBuilds: true },
  reactStrictMode: true,
  // Static export: makes the app deployable to any static host (Netlify Drop,
  // GitHub Pages, S3...). All pages are client-rendered, so nothing is lost.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
