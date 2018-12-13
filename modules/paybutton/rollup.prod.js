import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'

export default {
  input: 'src/PayButton.js',
  output: {
    file: 'build/PayButton.js',
    format: 'esm',
    sourcemap: true
  },
  plugins: [
    resolve(),
    commonjs({
      include: '../../node_modules/**'
    }),
    babel({
      exclude: '../../node_modules/**', // only transpile our source code
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    })
  ]
}
