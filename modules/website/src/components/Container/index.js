import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from '@material-ui/core'
import './style.css'

let Container = ({
  children,
  centered = false,
  fullWidth = false,
  halfWidth = false
}) => {
  let style = {}
  if (centered) {
    style.textAlign = 'center'
  }
  if (fullWidth) {
    style.minWidth = '100%'
  }
  if (halfWidth) {
    style.minWidth = '50%'
  }
  return (
    <div className="container" style={style}>
      <Paper className="paper">
        <div className="content">{children}</div>
      </Paper>
    </div>
  )
}

Container.propTypes = {
  children: PropTypes.any,
  centered: PropTypes.bool,
  fullWidth: PropTypes.bool,
  halfWidth: PropTypes.bool
}

export default Container
