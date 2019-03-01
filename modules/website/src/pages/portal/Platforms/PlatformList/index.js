import React, { useState, useMemo } from 'react'
import NewPlatformModal from './NewPlatformModal'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { withStyles } from '@material-ui/core'
import styles from './style'
import PlatformLineItem from './PlatformLineItem'
import List from '@material-ui/core/List'
import { getPlatforms } from 'API'
import PropTypes from 'prop-types'

const PlatformList = ({
  classes,
  selectedPlatform,
  setSelectedPlatform,
  shouldUpdatePlatformList,
  setShouldUpdatePlatformList
}) => {
  const [platformList, setPlatformList] = useState([])
  const [platformListComponent, setPlatformListComponent] = useState()

  useMemo(
    () => {
      getPlatforms().then(platforms => {
        platforms.length &&
          !selectedPlatform &&
          setSelectedPlatform(platforms[0])
        setPlatformList(platforms)
      })
    },
    [shouldUpdatePlatformList]
  )
  useMemo(
    () => {
      let platformLineItems = []
      platformList.forEach(platform => {
        let { platformID } = platform
        platformLineItems.push(
          <PlatformLineItem
            name={platform.name}
            onClick={() => setSelectedPlatform(platform)}
            key={platformID}
          />
        )
      })
      setPlatformListComponent(<List component="nav">{platformLineItems}</List>)
    },
    [platformList]
  )

  return (
    <Card>
      <CardContent>
        <div className={classes.title_wrap}>
          <h2>Your Platforms</h2>
          <NewPlatformModal
            onCreate={() =>
              setShouldUpdatePlatformList(shouldUpdatePlatformList + 1)
            }
          />
        </div>
        {platformListComponent}
      </CardContent>
    </Card>
  )
}

PlatformList.propTypes = {
  classes: PropTypes.object,
  setSelectedPlatform: PropTypes.func,
  shouldUpdatePlatformList: PropTypes.number,
  setShouldUpdatePlatformList: PropTypes.func,
  selectedPlatform: PropTypes.object
}

export default withStyles(styles)(PlatformList)
