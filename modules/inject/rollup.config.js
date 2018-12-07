import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'

export default {
  input: 'inject.js',
  output: {
    file: './../website/public/pay.js',
    format: 'iife',
  },
  plugins: [
    resolve(),
    commonjs({ include: '../../node_modules/**' }),
    babel({
      exclude: '../../node_modules/**', // only transpile our source code
    }),
  ],
}
