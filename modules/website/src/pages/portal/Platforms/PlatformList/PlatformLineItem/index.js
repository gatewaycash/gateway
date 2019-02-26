import React from 'react'
import styles from './style'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

const PlatformLineItem = ({ name, onClick, classes }) => (
  <React.Fragment>
    <ListItem button onClick={onClick} className={classes.lineItem}>
      <ListItemText primary={name} />
    </ListItem>
    <Divider />
  </React.Fragment>
)

PlatformLineItem.propTypes = {
  name: PropTypes.string,
  onClick: PropTypes.func,
  classes: PropTypes.object
}

export default withStyles(styles)(PlatformLineItem)
