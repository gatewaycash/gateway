import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'

export default {
  input: 'src/PayButton.js',
  output: {
    file: 'build/PayButton.js',
    format: 'esm',
    sourceMap: true
  },
  plugins: [
    resolve(),
    commonjs({ include: '../../node_modules/**' }),
    babel({
      exclude: '../../node_modules/**', // only transpile our source code
    }),
  ],
}
