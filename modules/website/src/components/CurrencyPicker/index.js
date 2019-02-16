import React, { useState } from 'react'
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select
} from '@material-ui/core'
import PropTypes from 'prop-types'

const CurrencyPicker = ({
  className,
  inputProps,
  showHelperText,
  SelectProps
}) => {
  const [value, setValue] = useState('BCH')
  return (
    <FormControl className={className}>
      <Select
        {...SelectProps}
        value={(SelectProps && SelectProps.value) || value}
        onChange={
          (SelectProps && SelectProps.onChange) ||
          (ev => setValue(ev.target.value))
        }
        inputProps={{
          id: 'currency-select',
          ...inputProps
        }}
      >
        <MenuItem value="BCH">BCH</MenuItem>
        <MenuItem value="USD">USD</MenuItem>
        <MenuItem value="EUR">EUR</MenuItem>
        <MenuItem value="CNY">CNY</MenuItem>
        <MenuItem value="JPY">JPY</MenuItem>
      </Select>
      {showHelperText !== false && <FormHelperText>Currency</FormHelperText>}
    </FormControl>
  )
}

CurrencyPicker.propTypes = {
  className: PropTypes.string,
  inputProps: PropTypes.object,
  showHelperText: PropTypes.bool,
  SelectProps: PropTypes.object
}

export default CurrencyPicker
