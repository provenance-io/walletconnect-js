let defaultPresets;
if (process.env.BABEL_ENV === 'es') {
  defaultPresets = [];
} else {
  defaultPresets = [
    [
      '@babel/preset-env',
      {
        modules: ['esm'].includes(process.env.BABEL_ENV) ? false : 'commonjs',
      },
    ],
  ];
}

const productionPlugins = [
  '@babel/plugin-transform-react-constant-elements',
  '@babel/plugin-proposal-object-rest-spread',
];
module.exports = {
  presets: defaultPresets.concat([
    '@babel/preset-typescript',
    '@babel/preset-react',
  ]),
  plugins: [
    [
      'babel-plugin-styled-components',
      {
        displayName: true,
        pure: true,
      },
    ],
  ],
  env: {
    cjs: {
      plugins: productionPlugins,
      ignore: ['**/*.test.js', '**/*.test.ts'],
    },
    es: {
      plugins: [
        ...productionPlugins,
        ['@babel/plugin-transform-runtime', { useESModules: true }],
      ],
      ignore: ['**/*.test.js', '**/*.test.ts'],
    },
    esm: {
      plugins: [
        ...productionPlugins,
        ['@babel/plugin-transform-runtime', { useESModules: true }],
      ],
      ignore: ['**/*.test.js', '**/*.test.ts'],
    },
  },
};
