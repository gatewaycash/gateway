import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'

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
    '@material-ui/icons',
    'prop-types',
    'bchaddrjs'
  ],
  plugins: [
    resolve({
      preferBuiltins: false,
    }),
    babel({
      exclude: [
        '../../node_modules/**',
        '*.json'
      ],
      presets: [
        ['@babel/env', {
          'modules': false,
          'targets': '> 0.25%, not dead'
        }],
        '@babel/preset-react',
      ],
      babelrc: false
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    })
  ]
}
