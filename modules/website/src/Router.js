import React from 'react'
import { Router, Redirect } from '@reach/router'

// import the top-level pages
import {
  Welcome,
  NotFound
} from './pages'

// import the portal's pages
import {
  CreateButton,
  Settings,
  Payments,
  Dashboard
} from './pages/portal'

// render the website
export default () => (
  <Router>
    <Redirect from="portal" to="portal/dashboard" noThrow />
    <Welcome key="Welcome" path="/" />
    <Dashboard key="Dashboard" path="portal/dashboard" />
    <CreateButton key="CreateButton" path="portal/create" />
    <Settings key="Settings" path="portal/settings" />
    <Payments key="Payments" path="portal/payments" />
    <NotFound default />
  </Router>
)
