import React from 'react'
import NavigationMenu from './NavigationMenu'
import Paper from '@material-ui/core/Paper'

export default () => (
  <>
    <NavigationMenu page="Dashboard" />
    <div className="container">
      <Paper className="paper leftPanel">
        <h1>Log In</h1>
      </Paper>
      <Paper className="paper rightPanel">
        <h1>Register</h1>
      </Paper>
    </div>
  </>
)
