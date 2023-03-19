module.exports = function (api) {
    api.cache(true);
    return {
      presets: ["babel-preset-expo"],
      plugins: [
        // NOTE: `expo-router/babel` is a temporary extension to `babel-preset-expo`.
        '@babel/plugin-proposal-export-namespace-from',
        'module:react-native-dotenv',
        require.resolve("expo-router/babel"),
        'react-native-reanimated/plugin',
      ],
    };
  };
  
  