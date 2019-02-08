import React from 'react'
import { Button as MUIButton } from '@material-ui/core'
import { Header } from '../../components'
import { Link } from '@reach/router'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import styles from 'jss/NavigationMenu'

let Button = props => (
  <Link to={props.to || '/'}>
    <MUIButton
      {...props}
      classes={{
        root: props.color === 'secondary' ?
          props.classes.button_secondary :
          window.location.pathname === props.to ?
            props.classes.button_active :
            props.classes.button_normal
      }}
    >
      {props.children}
    </MUIButton>
  </Link>
)
Button.propTypes = {
  to: PropTypes.string,
  children: PropTypes.any
}
Button = withStyles(styles)(Button)

let NavigationMenu = ({ page }) => (
  <div>
    <Header page={page}>
      <Button to="/portal/dashboard">DASHBOARD</Button>
      <Button to="/portal/create">CREATE BUTTON</Button>
      <Button to="/portal/payments">PAYMENTS</Button>
      <Button to="/portal/settings">ACCOUNT</Button>
      <Button
        color="secondary"
        onClick={() => delete sessionStorage.gatewayAPIKey}
        to="/"
      >
        OUG OUT
      </Button>
    </Header>
  </div>
)

export default withStyles(styles)(NavigationMenu)
