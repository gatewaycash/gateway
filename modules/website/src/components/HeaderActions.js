import React from 'react'
import OpenInNewSharp from '@material-ui/icons/OpenInNew'
import { Button } from '@material-ui/core'
import PropTypes from 'prop-types'
import { Link } from '@reach/router'
import styles from '../jss/Header'
import withStyles from '@material-ui/core/styles/withStyles'

const HeaderActions = ({ classes, children }) => (
  <React.Fragment>
    {window.location.pathname !== '/' ? (
      <ul className={classes.header_actions}>{children}</ul>
    ) : (
      <ul className={classes.header_actions}>
        <li>
          <Button
            href="https://www.youtube.com/watch?v=jduVN643Prc"
            target="_blank"
            className={classes.what_is_bitcoin}
            classes={{ label: classes.what_is_bitcoin__label }}
          >
            <span>What&nbsp;is&nbsp;Bitcoin&nbsp;Cash?</span>
            <OpenInNewSharp className={classes.external_link} />
          </Button>
        </li>
        <li>
          <Link to="portal">
            <Button color="primary" variant="contained">
              {sessionStorage.gatewayAPIKey ? 'Dashboard' : 'Get Started'}
            </Button>
          </Link>
        </li>
      </ul>
    )}
  </React.Fragment>
)

HeaderActions.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.any
}

export default withStyles(styles)(HeaderActions)
