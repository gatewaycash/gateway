import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'

export default {
  input: 'inject.js',
  output: {
    file: './../website/public/pay.js',
    format: 'umd',
    sourcemap: true
  },
  plugins: [
    resolve({
      browser: true
    }),
    commonjs({ include: '../../node_modules/**' }),
    babel({
      exclude: '../../node_modules/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    })
  ],
}
