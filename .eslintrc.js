module.exports = {
  extends: [
    'airbnb',
    'airbnb/hooks',
    'eslint:recommended',
    'prettier',
  ],
  parser: 'babel-eslint',
  rules: {
    'arrow-body-style': ['warn', 'as-needed'],
    'consistent-return': 'warn',
    'import/newline-after-import': 'error',
    'import/order': ['error', { groups: [['builtin', 'external', 'internal']] }],
    'import/prefer-default-export': 0,
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-duplicate-imports': 'warn',
    'no-var': 'warn',
    'object-shorthand': 'warn',
    'prefer-arrow-callback': 'warn',
    'prefer-const': 'warn',
    'prefer-spread': 'warn',
    'react/forbid-prop-types': ['error', { forbid: ['any'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx'] }],
    'react-hooks/rules-of-hooks': 'error',
    'react/default-props-match-prop-types': 'warn',
    'react/no-unused-prop-types': 'warn',
    'react/prefer-stateless-function': 'warn',
    'react/prop-types': 'warn',
    'react/require-default-props': 'warn',
  },
  plugins: ['prettier', 'react-hooks'],
  env: {
    browser: true,
    jest: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
    "import/resolver": {
      node: {
        moduleDirectory: ["node_modules/", "src/"]
      }
    }
  },
};