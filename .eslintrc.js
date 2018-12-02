module.exports = {
  extends: ['prettier', 'react-app'],
  plugins: ['prettier', 'babel'],
  parser: 'babel-eslint',
  rules: {
    'prettier/prettier': [
      1,
      {
        semi: false,
        singleQuote: true,
        trailingComma: 'all',
        arrowParens: 'always',
      },
    ],
  },
}
