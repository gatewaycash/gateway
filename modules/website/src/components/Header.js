import React from 'react'
import PropTypes from 'prop-types'
import Logo from 'res/logo.svg.js'
import styles from '../jss/Header'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link } from '@reach/router'
import HeaderActions from './HeaderActions'
import HeaderActionsMobile from './mobile/HeaderActionsMobile'

const Header = ({ classes, children }) => (
  <div className={classes.header_wrap}>
    <div className={classes.header_logo_wrap}>
      <Link to="/" className={classes.header_logo}>
        <Logo />
        <h1 className={classes.header_text}>Gateway.cash</h1>
      </Link>
    </div>
    <HeaderActions>{children}</HeaderActions>
    <HeaderActionsMobile>{children}</HeaderActionsMobile>
  </div>
)

Header.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.any
}

export default withStyles(styles)(Header)
