module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        cwd: 'babelrc',
        root: ['./'],
        extensions: ['.js'],
        alias: {
          assets: './app/assets',
          screens: './app/components/screens',
          views: './app/components/views',
          models: './app/models',
          store: './app/store',
        },
      },
    ],
  ],
};
