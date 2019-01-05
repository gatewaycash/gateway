import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import json from 'rollup-plugin-json'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import { uglify } from 'rollup-plugin-uglify'

export default {
  input: 'inject.js',
  output: {
    file: './../website/public/pay.js',
    format: 'iife',
  },
  plugins: [
    babel({
      exclude: [
        '../../node_modules/**',
        '*.json'
      ],
      babelrc: false,
      presets: [
        ['@babel/env', {
          'modules': false,
          'targets': '> 0.25%, not dead'
        }],
        '@babel/preset-react'
      ]
    }),
    commonjs({
      //include: '../../node_modules/**'
    }),
    resolve({
      browser: true,
      jsnext: true,
      preferBuiltins: false
    }),
    json(),
    builtins(),
    globals(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    uglify()
  ]
}
