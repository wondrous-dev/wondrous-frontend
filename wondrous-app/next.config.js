const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  images: { domains: ['www.notion.so', 'storage.googleapis.com'] },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    // config.optimization.minimizer = [];
    return config;
  },
  swcMinify: true,
});
