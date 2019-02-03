import React, { useState, useRef } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import styles from './style'
import PropTypes from 'prop-types'
import FileCopy from '@material-ui/icons/FileCopy'
import Tooltip from '@material-ui/core/Tooltip'

const SourceCode = ({ children, classes }) => {
  const [showToolTip, setShowToolTip] = useState(false)
  const sourceEl = useRef(void 0)

  const copySource = () => {
    let range = document.createRange()
    range.selectNode(sourceEl.current)
    getSelection().removeAllRanges()
    getSelection().addRange(range)
    document.execCommand('copy')
    getSelection().removeRange(range)
    setShowToolTip(true)
    setTimeout(() => {
      setShowToolTip(false)
    }, 700)
  }
  return (
    <div className={classes.source_code_wrap}>
      <Tooltip
        title="Copied!"
        open={showToolTip}
        classes={{ tooltip: classes.tooltip }}
      >
        <React.Fragment>
          <xmp className={classes.source_code} ref={sourceEl}>
            {children}
          </xmp>
          <FileCopy className={classes.copy_icon} onClick={copySource} />
        </React.Fragment>
      </Tooltip>
    </div>
  )
}
SourceCode.propTypes = {
  children: PropTypes.any,
  classes: PropTypes.object
}
export default withStyles(styles)(SourceCode)
