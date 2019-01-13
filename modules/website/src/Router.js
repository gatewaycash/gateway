import React from 'react'
import { Router } from '@reach/router'

// import the top-level pages
import {
  Welcome,
  NotFound
} from './pages'

// import the portal's pages
import {
  Portal,
  Dashboard,
  CreateButton,
  Payments,
  Settings
} from './pages/portal'

// render the website
export default () => (
  <Router>
    <Welcome key="Welcome" path="/" />
    <Portal key="Portal" path="portal" />
    <Dashboard key="Dashboard" path="portal/dashboard" />
    <CreateButton key="CreateButton" path="portal/create" />
    <Payments key="Payments" path="portal/payments" />
    <Settings key="Settings" path="portal/settings" />
    <NotFound default />
  </Router>
)
