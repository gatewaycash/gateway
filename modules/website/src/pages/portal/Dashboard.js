import React, { Component } from 'react'
import NavigationMenu from './NavigationMenu'
import { navigate } from '@reach/router'
import { Paper } from '@material-ui/core'
import Footer from './../../components/Footer'
import {merchantid, getUsername, getAddress, totalsales } from './../../API'

export default class Dashboard extends Component {

  state = {
    username: 'loading...',
    address: 'loading...',
    totalSales: 'loading...',
    merchantID: 'loading...'
  }

  constructor (props) {
    super(props)
    // redirect to /portal to log in if needed
    !sessionStorage.gatewayAPIKey && navigate('/portal')
    getUsername().then((response) => {
      if (response.status === 'success') {
        this.setState({username: response.username})
      }
    })

    getAddress().then((response) => {
      if (response.status === 'success') {
        this.setState({address: response.payoutAddress})
      }
    })

    merchantid().then((response) => {
      if (response.status === 'success') {
        this.setState({merchantID: response.merchantID})
      }
    })

    totalsales().then((response) => {
      if (response.status === 'success') {
        this.setState({totalSales: response.totalSales})
      }
    })
  }

  render () {
    return (
      <>
        <NavigationMenu page="Dashboard" />
        <Paper className="paper container">
          <h1>{this.state.username.toUpperCase()}</h1>
          <p>Your address: {this.state.address}</p>
          <p>Total sales: {(this.state.totalSales / 100000000)} BCH</p>
          <p>Your Merchant ID: {this.state.merchantID}</p>
          <h2>Using Your New Account</h2>
          <p>
            Check out the <a href="/docs">PayButton docs</a> to see all the ways
            you can use your new merchant ID. Use the <b>Create&nbsp;Button</b> tab to generate customizable payment buttons for your websites,
            apps and services.
          </p>
        </Paper>
        <Footer />
      </>
    )
  }
}
