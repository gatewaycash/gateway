import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import json from 'rollup-plugin-json'

export default {
  input: 'src/PayButton.js',
  output: {
    file: 'build/PayButton.js',
    format: 'esm'
  },
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
      jsnext: true
    }),
    commonjs({
      include: '../../node_modules/**'
    }),
    babel({
      exclude: [
        '../../node_modules/**',
        '*.json'
      ]
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    }),
    json()
  ]
}
