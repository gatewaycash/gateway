import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import include from 'rollup-plugin-includepaths'

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
    '@material-ui/core/styles/withStyles',
    'prop-types',
    'bchaddrjs',
    'qrcode.react'
  ],
  plugins: [
    resolve({
      preferBuiltins: true
    }),
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
      ]
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    include({
      paths: ['src'],
      extensions: ['.js']
    })
  ]
}
