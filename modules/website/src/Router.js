import React from 'react'
import { Router as ReactRouter } from '@reach/router'
import { Welcome, NotFound } from './pages'
import {
  Portal,
  Dashboard,
  CreateButton,
  Payments,
  Settings,
  Platforms
} from './pages/portal'
import { withStyles } from '@material-ui/core'
import styles from 'style/base'

const Router = ({ classes }) => (
  <ReactRouter className={classes.router}>
    <Welcome key="Welcome" path="/" />
    <Portal key="Portal" path="portal" />
    <Dashboard key="Dashboard" path="portal/dashboard" />
    <CreateButton key="CreateButton" path="portal/create" />
    <Payments key="Payments" path="portal/payments" />
    <Settings key="Settings" path="portal/settings" />
    <Platforms key="Platforms" path="portal/platforms" />
    <NotFound default />
  </ReactRouter>
)

// render the website
export default withStyles(styles)(Router)
