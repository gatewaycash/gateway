import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import json from 'rollup-plugin-json'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'

export default {
  input: 'inject.js',
  output: {
    file: './../website/public/pay.js',
    format: 'iife',
    sourcemap: true,
    global: {}
  },
  plugins: [
    commonjs({ include: '../../node_modules/**' }),
    babel({
      exclude: '../../node_modules/**',
      babelrc: false,
      presets: [
        ['@babel/env', {
          modules: false
        }],
        '@babel/preset-react'
      ]
    }),
    resolve({
      browser: true,
      jsnext: true,
      preferBuiltins: true
    }),
    json(),
    builtins(),
    globals(),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'development' )
    })
  ]
}
