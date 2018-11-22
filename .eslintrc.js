module.exports = {
  extends: ['prettier'],
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
