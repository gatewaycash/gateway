import React from 'react'

export default ({ children, centered = false }) => (
  <p
    style={{
      display: 'block',
      width: '100%',
      textAlign: centered ? 'center' : 'left'
    }}
  >
    {children}
  </p>
)
