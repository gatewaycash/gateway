import React, { useState } from 'react'
import NavigationMenu from '../NavigationMenu'
import { Footer } from 'components'
import styles from './style'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import PlatformDetails from './PlatformDetails'
import PlatformList from './PlatformList'

const Platforms = ({ classes }) => {
  const [selectedPlatform, setSelectedPlatform] = useState(void 0)
  const [shouldUpdatePlatformList, setShouldUpdatePlatformList] = useState(0)

  return (
    <React.Fragment>
      <NavigationMenu page="Platforms" />
      <div className={classes.content_wrap}>
        <PlatformList
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
          setShouldUpdatePlatformList={setShouldUpdatePlatformList}
          shouldUpdatePlatformList={shouldUpdatePlatformList}
        />
        <PlatformDetails
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
          updatePlatformList={() =>
            setShouldUpdatePlatformList(shouldUpdatePlatformList + 1)
          }
        />
      </div>
      <Footer />
    </React.Fragment>
  )
}

Platforms.propTypes = {
  classes: PropTypes.any
}

export default withStyles(styles)(Platforms)
