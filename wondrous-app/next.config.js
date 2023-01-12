const CompressionPlugin = require('compression-webpack-plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  /* config options here */
  reactStrictMode: true,
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  images: {
    domains: [
      'www.notion.so',
      'storage.googleapis.com',
      'pbs.twimg.com',
      'avatars.githubusercontent.com',
      's3.amazonaws.com',
      'images.mintkudos.xyz',
    ],
  },
  experimental: {
    modularizeImports: {
      lodash: {
        transform: 'lodash/{{member}}',
      },
      '@mui/material': {
        transform: '@mui/material/{{member}}',
      },
      '@mui/lab': {
        transform: '@mui/lab/{{member}}',
      },
      '@mui/icons-material/?(((\\w*)?/?)*)': {
        transform: '@mui/icons-material/{{ matches.[1] }}/{{member}}',
      },
    },
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    config.plugins.push(new CompressionPlugin());

    return config;
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
            value: `max-age=${60 * 60 * 24 * 365}, public`,
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
            value: `max-age=${60 * 60 * 24 * 7}, must-revalidate`,
          },
        ],
      },
    ];
  },
});
