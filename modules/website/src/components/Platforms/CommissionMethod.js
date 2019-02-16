import React from 'react'
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select
} from '@material-ui/core'
import PropTypes from 'prop-types'

const CommissionMethod = ({ value, onChange, showHelperText }) => (
  <FormControl>
    <Select
      value={value || 'address'}
      onChange={onChange}
      inputProps={{
        name: 'commissionMethod'
      }}
    >
      <MenuItem value="address">Address</MenuItem>
      <MenuItem value="XPUB">XPUB</MenuItem>
    </Select>
    {showHelperText !== false && (
      <FormHelperText>Commission Method</FormHelperText>
    )}
  </FormControl>
)

CommissionMethod.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  showHelperText: PropTypes.bool
}

export default CommissionMethod
