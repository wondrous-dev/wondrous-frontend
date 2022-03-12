const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  compress: true,
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  swcMinify: true,
  experimental: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  async headers() {
    return [
      {
        // Set up caching on media files for 1 year
        source: '/:all*(flv|ico|pdf|avi|mov|ppt|doc|mp3|wmv|wav|gif|jpg|jpeg|png|swf)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: `max-age=${60*60*24*365}, public`,
          },
        ],
      },
      {
        // Set up caching on js/css files for 1 week
        source: '/:all*(xml|txt|js|css)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: `max-age=${60*60*24*7}, must-revalidate`,
          },
        ],
      },
    ];
  },
});
