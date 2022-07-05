const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-dark-mode',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  staticDirs: ['../public'],
  webpackFinal: async (config, { configType }) => {
    config.resolve.plugins = [new TsconfigPathsPlugin()];

    config.resolve.alias['next/image'] = require.resolve('./NextImage.js');

    // config.plugins.push(new webpack.DefinePlugin({
    //   'process.env.__NEXT_IMAGE_OPTS': JSON.stringify({
    //     deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    //     imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    //     domains: [],
    //     path: '/',
    //     loader: 'default',
    //   }),
    // }));

    return config;
  },
};
