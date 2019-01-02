import React from 'react'
import { Paper } from '@material-ui/core'
import './style.css'

export default ({ children, centered = false }) => (
  <div
    className="container"
    style={{
      textAlign: centered ? 'center' : 'left'
    }}
  >
    <Paper className="paper">
      <div className="content">
        {children}
      </div>
    </Paper>
  </div>
)
