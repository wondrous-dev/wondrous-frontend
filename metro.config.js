const { getDefaultConfig } = require("@expo/metro-config")

module.exports = (async () => {
  const defaultConfig = getDefaultConfig(__dirname)

  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false
        }
      }),
      babelTransformerPath: require.resolve("react-native-svg-transformer")
    },
    resolver: {
      assetExts: [
        ...defaultConfig.resolver.assetExts.filter((ext) => ext !== 'svg')
      ],
      sourceExts: [...defaultConfig.resolver.sourceExts, 'svg']
    }
  }
})()