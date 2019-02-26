import React from 'react'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { withStyles } from '@material-ui/core'
import styles from './style'
import PropTypes from 'prop-types'
import CommissionList from './CommissionList'
import { WarningTwoTone } from '@material-ui/icons'

const PlatformDetails = ({ selectedPlatform, classes }) => {
  return (
    <Card>
      <CardContent>
        <Card>
          <CardContent classes={{ root: classes.notice_card_root }}>
            <WarningTwoTone className={classes.notice_icon} />
            <span>
              <strong>Notice:</strong> The Platforms API is Currently in Alpha
            </span>
          </CardContent>
        </Card>
        {selectedPlatform && (
          <React.Fragment>
            <div className={classes.selected_platform_title_wrap}>
              <div>
                <h1>{selectedPlatform.name}</h1>
                <span>ID: {selectedPlatform.platformID}</span>
                <p className={classes.selected_platform_description}>
                  {selectedPlatform.description}
                </p>
              </div>
              <Button variant="contained" disabled={true}>
                EDIT
              </Button>
            </div>
            <CommissionList platformID={selectedPlatform.platformID} />
          </React.Fragment>
        )}
      </CardContent>
    </Card>
  )
}

PlatformDetails.propTypes = {
  classes: PropTypes.object,
  selectedPlatform: PropTypes.object
}

export default withStyles(styles)(PlatformDetails)
