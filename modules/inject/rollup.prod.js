import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'

// Import the development configuration.
import config from './rollup.dev.js'

// tweak the config for production

// set NODE_ENV environment variable for production
config.plugins[6] = replace({
  'process.env.NODE_ENV': JSON.stringify('production')
})

// inject uglify
config.plugins[7] = uglify

// disable source map
config.output.sourcemap = false

export default config
