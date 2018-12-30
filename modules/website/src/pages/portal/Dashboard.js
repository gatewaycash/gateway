import React from 'react'
import NavigationMenu from './NavigationMenu'
import { navigate } from '@reach/router'
import { Paper } from '@material-ui/core'
import Footer from './../../components/Footer'

export default () => {
  // redirect to /portal to log in if needed
  !sessionStorage.gatewayAPIKey && navigate('/portal')
  return (
    <>
      <NavigationMenu page="Dashboard" />
      <Paper className="paper container">
        <center>
          <h1>The dash is a board.</h1>
        </center>
      </Paper>
      <Footer />
    </>
  )
}
