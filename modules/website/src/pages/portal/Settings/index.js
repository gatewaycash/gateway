import React from 'react'
import Username from './Username'
import Password from './Password'
import SupportProject from './SupportProject'
import APIInfo from './APIInfo'
import { Footer } from 'components'
import NavigationMenu from './../NavigationMenu'
import { Card, CardContent } from '@material-ui/core'
import styles from './style'
import withStyles from '@material-ui/core/styles/withStyles'

const Settings = ({ classes }) => (
  <React.Fragment>
    <NavigationMenu page="Your Account" />
    <div className={classes.content_wrap}>
      <Username className={classes.username} />
      <Password className={classes.password} />
      <APIInfo className={classes.api_access} />
      <Card className={classes.display_currency}>
        <CardContent>
          <h2>Display Currency</h2>
          <p>
            Bitcoin Cash (BCH) units will always be displayed. In places like
            the View Payments page, you can choose to have values converted and
            displayed in other currencies as well. When viewing payments, you
            will be shown the current value as well as what the value was at the
            time the payment was made.
          </p>
          <p>This feature hasn't been built yet, please check back soon.</p>
        </CardContent>
      </Card>
      <SupportProject className={classes.support_project} />
    </div>
    <Footer />
  </React.Fragment>
)

export default withStyles(styles)(Settings)
