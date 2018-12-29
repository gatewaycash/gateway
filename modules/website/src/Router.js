import React from 'react'
import { Router } from '@reach/router'
import { Welcome } from './pages'
import { CreateButton, Settings, Payments, Portal } from './pages/portal'
import NotFound from './NotFound'

export default () => (
  <Router>
    <Welcome key="Welcome" path="/" />
    <Portal key="Portal" path="portal" />
    <CreateButton key="CreateButton" path="portal/create" />
    <Settings key="Settings" path="portal/settings" />
    <Payments key="Payments" path="portal/payments" />
    <NotFound default />
  </Router>
)
