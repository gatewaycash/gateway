import React from 'react'
import PropTypes from 'prop-types'
import Logo from 'res/logo.svg.js'
import styles from './style'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link } from '@reach/router'
import HeaderActions from './actions'
import { HeaderMobile as HeaderActionsMobile } from 'components'

const Header = ({ classes, children, page = 'Gateway' }) => (
  <div className={classes.header_wrap}>
    <div className={classes.header_logo_wrap}>
      <Link to="/" className={classes.header_logo}>
        <Logo />
        <h1 className={classes.header_text}>{page}</h1>
      </Link>
    </div>
    <HeaderActions>{children}</HeaderActions>
    <HeaderActionsMobile>{children}</HeaderActionsMobile>
  </div>
)

Header.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.any,
  page: PropTypes.string
}

export default withStyles(styles)(Header)
