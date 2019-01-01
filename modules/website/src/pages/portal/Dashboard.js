import React, { Component } from 'react'
import NavigationMenu from './NavigationMenu'
import { navigate } from '@reach/router'
import Footer from 'components/Footer'
import Container from 'components/Container'
import Text from 'components/Text'
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
        <Container>
          <h1>{this.state.username.toUpperCase()}</h1>
          <Text>Your address: {this.state.address}</Text>
          <Text>Total sales: {(this.state.totalSales / 100000000)} BCH</Text>
          <Text>Your Merchant ID: {this.state.merchantID}</Text>
          <h2>Using Your New Account</h2>
          <Text>
            Check out the <a href="/docs">PayButton docs</a> to see all the ways
            you can use your new merchant ID. Use the <b>Create&nbsp;Button</b> tab to generate customizable payment buttons for your websites,
            apps and services.
          </Text>
        </Container>
        <Footer />
      </>
    )
  }
}
