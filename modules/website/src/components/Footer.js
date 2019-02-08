import React from 'react'
import styles from '../jss/Footer'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'

const Footer = ({ classes }) => (
  <div className={classes.wrap}>
    <div className={classes.a}>
      <strong>Social:</strong>
      <a
        href="https://twitter.com/cash_gateway"
        target="_blank"
        className={classes.link}
        rel="noopener noreferrer"
      >
        Twitter
      </a>
      <a
        href="mailto:hello@gateway.cash"
        target="_blank"
        className={classes.link}
        rel="noopener noreferrer"
      >
        Email
      </a>
    </div>
    <div className={classes.b}>
      <strong>Community:</strong>
      <a
        href="https://ambassador.cash"
        target="_blank"
        className={classes.link}
        rel="noopener noreferrer"
      >
        Discord (#gatewaycash)
      </a>
    </div>
    <div className={classes.c}>
      <strong>Docs:</strong>
      <a
        href="/docs"
        target="_blank"
        className={classes.link}
        rel="noopener noreferrer"
      >
        PayButton Docs
      </a>
      <a
        href="https://api.gateway.cash/"
        target="_blank"
        className={classes.link}
        rel="noopener noreferrer"
      >
        API Docs
      </a>
      <a
        href="https://github.com/gatewaycash/gateway"
        target="_blank"
        className={classes.link}
        rel="noopener noreferrer"
      >
        GitHub Page
      </a>
    </div>
    <div className={classes.d}>
      <span className={classes.legal}>
        Copyright &copy; 2019 Gateway
        <br />
        Licensed AGPL. Privacy
        <strong> IS</strong> our policy.
      </span>
    </div>
  </div>
)

Footer.propTypes = {
  classes: PropTypes.object
}

export default withStyles(styles)(Footer)
