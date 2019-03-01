import React from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Select } from '@material-ui/core'
import PropTypes from 'prop-types'
import { theme } from './theme'

/* The Select used in the commissions table on the platforms API page */

const CTSelect = props => (
  <MuiThemeProvider theme={theme}>
    <Select {...props}>{props.children}</Select>
  </MuiThemeProvider>
)

CTSelect.propTypes = {
  children: PropTypes.any
}

export default CTSelect
