import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import includePaths from 'rollup-plugin-includepaths'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/PayButton.js',
  output: {
    file: 'build/PayButton.js',
    format: 'esm'
  },
  external: [
    'react',
    'axios',
    'socket.io-client',
    '@material-ui/core',
    '@material-ui/core/Button',
    '@material-ui/core/Dialog',
    '@material-ui/core/DialogTitle',
    '@material-ui/core/DialogContent',
    '@material-ui/icons',
    '@material-ui/icons/Done',
    'prop-types',
    'bchaddrjs'
  ],
  plugins: [
    resolve({
      preferBuiltins: false
    }),
    commonjs({ include: '../../node_modules/**' }),
    babel({
      exclude: '../../node_modules/**',
      babelrc: false,
      presets: [
        [
          '@babel/env',
          {
            modules: false,
            targets: {
              chrome: '58',
              ie: '11'
            },
            useBuiltIns: 'usage'
          }
        ],
        '@babel/preset-react'
      ],
      plugins: [
        '@babel/transform-regenerator',
        '@babel/plugin-external-helpers'
      ]
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    includePaths({
      paths: ['src'],
      extensions: ['.js']
    })
  ]
}
