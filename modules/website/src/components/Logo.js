import React from 'react'
import logo from 'res/logo.svg'

export default ({ size = 10, centered = false }) => (
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
