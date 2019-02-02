import React from 'react'
import { Button as MUIButton } from '@material-ui/core'
import { Header } from '../../components'
import { Link } from '@reach/router'
import PropTypes from 'prop-types'

const Button = props => (
  <Link to={props.to || '/'}>
    <MUIButton
      {...props}
      color={window.location.pathname === props.to ? 'primary' : 'default'}
    >
      {props.children}
    </MUIButton>
  </Link>
)
Button.propTypes = {
  to: PropTypes.string,
  children: PropTypes.any
}

export default ({ page }) => (
  <div>
    <Header page={page}>
      <Button to="/portal/dashboard">Dashboard</Button>
      <Button to="/portal/create">Create Button</Button>
      <Button to="/portal/payments">Payments</Button>
      <Button to="/portal/settings">Account</Button>
      <Button
        color="secondary"
        onClick={() => delete window.sessionStorage.gatewayAPIKey}
        to="/"
      >
        Log Out
      </Button>
    </Header>
  </div>
)
