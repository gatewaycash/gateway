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
  SelectProps,
  SelectComponent,
  value
}) => {
  const [valueState, setValue] = useState(value || 'BCH')

  SelectComponent = SelectComponent || Select
  return (
    <FormControl className={className}>
      <SelectComponent
        {...SelectProps}
        value={(SelectProps && SelectProps.value) || valueState}
        onChange={ev => {
          setValue(ev.target.value)
          SelectProps && SelectProps.onChange(ev)
        }}
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
      </SelectComponent>
      {showHelperText !== false && <FormHelperText>Currency</FormHelperText>}
    </FormControl>
  )
}

CurrencyPicker.propTypes = {
  className: PropTypes.string,
  inputProps: PropTypes.object,
  showHelperText: PropTypes.bool,
  SelectProps: PropTypes.object,
  SelectComponent: PropTypes.any,
  value: PropTypes.string
}

export default CurrencyPicker
