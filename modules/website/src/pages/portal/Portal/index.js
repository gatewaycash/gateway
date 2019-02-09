import React from 'react'
import { navigate } from '@reach/router'
import Login from './Login'
import Register from './Register'
import { Header, Footer } from 'components'
import OnboardingInfo from './OnboardingInfo'
import styles from './style'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'

const Portal = ({ classes }) => {
  sessionStorage.gatewayAPIKey && navigate('/portal/dashboard')
  return (
    <div>
      <Header />
      <div className={classes.content_wrap}>
        <Login className={classes.login} />
        <Register className={classes.register} />
        <OnboardingInfo className={classes.onboarding_info} />
      </div>
      <Footer />
    </div>
  )
}

Portal.propTypes = {
  classes: PropTypes.object
}

export default withStyles(styles)(Portal)
