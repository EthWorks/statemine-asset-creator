module.exports = {
  core: {
    builder: "webpack5",
  },
  "stories": [
    "../components/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  webpackFinal: (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        fallback: {
          ...config.fallback,
          "stream": require.resolve('stream-browserify'),
          "crypto": require.resolve('crypto-browserify'),
          "path": require.resolve('path-browserify'),
        },
      }
    }
  }
}