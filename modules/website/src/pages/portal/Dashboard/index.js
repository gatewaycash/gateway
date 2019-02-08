import React, { Component } from 'react'
import NavigationMenu from './../NavigationMenu'
import { navigate } from '@reach/router'
import { Footer, SourceCode } from 'components'
import { merchantid, getUsername, getAddress, totalsales } from 'API'
import styles from './style'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import { Card, CardContent } from '@material-ui/core'

class Dashboard extends Component {
  state = {
    username: 'loading...',
    address: 'loading...',
    totalSales: 'loading...',
    merchantID: 'loading...'
  }

  constructor(props) {
    super(props)
    // redirect to /portal to log in if needed
    !sessionStorage.gatewayAPIKey && navigate('/portal')
    getUsername().then(response => {
      if (response.status === 'success') {
        this.setState({ username: response.username })
      }
    })

    getAddress().then(response => {
      if (response.status === 'success') {
        this.setState({ address: response.address })
      }
    })

    merchantid().then(response => {
      if (response.status === 'success') {
        this.setState({ merchantID: response.merchantID })
      }
    })

    totalsales().then(response => {
      if (response.status === 'success') {
        this.setState({ totalSales: response.totalSales })
      }
    })
  }

  render() {
    return (
      <React.Fragment>
        <NavigationMenu page="Dashboard" />
        <div className={this.props.classes.main_content_wrap}>
          <Card>
            <CardContent>
              <h1>{this.state.username.toUpperCase()}</h1>
              <p>Total sales: {this.state.totalSales / 100000000} BCH</p>
              <p>Your address:</p>
              <SourceCode>{this.state.address}</SourceCode>
              <p>Your Merchant ID: {this.state.merchantID}</p>
              <h2>Using Your New Account</h2>
              <p>
                Check out the <a href="/docs">PayButton docs</a> to see all the
                ways you can use your new merchant ID. Use the{' '}
                <b>Create&nbsp;Button</b> tab to generate customizable payment
                buttons for your websites, apps and services.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2>Leveraging the Power of Gateway</h2>
              <p>
                When it comes down to it, accepting Bitcoin Cash is as simple as
                slapping a QR code on a site, blog or even a refrigerator at a
                meetup to accept donations for good content, beer or anything
                else the world has to offer.
              </p>
              <p>
                When you use Gateway, the experience for customers becomes
                standard and you gain the power to track orders, set prices in
                other currencies and more. Understanding the features and
                capabilities of Gateway is the first step on the road to
                mastering Bitcoin Cash as a whole.
              </p>
            </CardContent>
          </Card>
          <Card className={this.props.classes.why_of_crypto}>
            <CardContent>
              <h2>The "Why" of Crypto</h2>
              <p>
                The Gateway project is closely affiliated with communities of
                ambassadors, pioneers and early adopters of Bitcoin Cash. These
                organizations span the globe with meetups in places like London
                and New York City, but also have a presence in third-world
                countries like South Sudan, Venezuela and others.
              </p>
              <p>
                In these places, currency is unstable due to hyperinflation and
                it is becoming difficult or impossible for everyday people to
                make a living or build a life.
              </p>
              <p>
                Cryptocurrencies like Bitcoin Cash provide the refuge needed by
                unbanked populations worldwide from money-printing regimes. By
                building these tools according to the needs of everyday people,
                Gateway strives to create a new and open standard for financial
                transactions, built on an open system, in pursuit of an open
                world.
              </p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </React.Fragment>
    )
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object
}

export default withStyles(styles)(Dashboard)
