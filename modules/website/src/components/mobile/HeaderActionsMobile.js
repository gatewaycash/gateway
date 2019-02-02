import React from 'react'
import styles from '../../jss/HeaderMobile'
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Reorder from '@material-ui/icons/Reorder'
import PropTypes from 'prop-types'
import OpenInNewSharp from '@material-ui/icons/OpenInNew'
import { Link } from '@reach/router'

const HeaderActionsMobile = ({ classes, children }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  function handleClose() {
    setAnchorEl(null)
  }
  const menuNodes = []
  if (window.location.pathname !== '/') {
    for (let ix in children) {
      let child = children[ix]
      let node = (
        <MenuItem onClick={handleClose} key={ix}>
          {child}
        </MenuItem>
      )
      menuNodes.push(node)
    }
  }
  return (
    <React.Fragment>
      {menuNodes.length || window.location.pathname === '/' ? (
        <React.Fragment>
          <Button
            onClick={ev => setAnchorEl(ev.currentTarget)}
            className={classes.action_icon}
            classes={{ label: classes.action_icon__label }}
            disableRipple={true}
          >
            <Reorder />
          </Button>

          {window.location.pathname !== '/' ? (
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {menuNodes}
            </Menu>
          ) : (
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <Link to="portal" className={classes.link}>
                <MenuItem onClick={handleClose}>Get Started</MenuItem>
              </Link>
              <MenuItem onClick={handleClose}>
                <a
                  href="https://www.youtube.com/watch?v=jduVN643Prc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>What is Bitcoin Cash?</span>
                  <OpenInNewSharp className={classes.external_link} />
                </a>
              </MenuItem>
            </Menu>
          )}
        </React.Fragment>
      ) : (
        void 0
      )}
    </React.Fragment>
  )
}

HeaderActionsMobile.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.any
}

export default withStyles(styles)(HeaderActionsMobile)
