import React from 'react'
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select
} from '@material-ui/core'
import PropTypes from 'prop-types'

const CommissionLessMore = ({ classes, value, onChange, showHelperText }) => (
  <FormControl>
    <Select
      value={value || 'more'}
      onChange={onChange}
      inputProps={{
        name: 'commissionLessMore'
      }}
    >
      <MenuItem value="more">More</MenuItem>
      <MenuItem value="less">Less</MenuItem>
    </Select>
    {showHelperText !== false && (
      <FormHelperText classes={classes}>
        Charge the lesser or greater commission fee (of percent or flat fee)
      </FormHelperText>
    )}
  </FormControl>
)

CommissionLessMore.propTypes = {
  classes: PropTypes.object,
  onChange: PropTypes.func,
  value: PropTypes.string,
  showHelperText: PropTypes.bool
}

export default CommissionLessMore
