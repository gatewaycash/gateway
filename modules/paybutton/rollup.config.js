import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

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
      babelrc: false,
      presets: [
        '@babel/preset-react'
      ]
    })
  ]
}
