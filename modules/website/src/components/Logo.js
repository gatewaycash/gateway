import React from 'react'
import PropTypes from 'prop-types'
import logo from 'res/logo.svg'

const Logo = ({ size = 10, centered = false }) => (
  <a href="/">
    <img
      style={{
        width: (size + 'em'),
        marginLeft: (centered === false ? 'default' : 'auto'),
        marginRight: (centered === false ? 'default' : 'auto'),
        display: (centered === false ? 'inline' : 'block')
      }}
      alt="Gateway.cash logo"
      poster="Gateway.cash logo"
      title="Gateway.cash logo"
      src={logo}
    />
  </a>
)

Logo.propTypes = {
  size: PropTypes.integer,
  centered: PropTypes.boolean
}

export default Logo
