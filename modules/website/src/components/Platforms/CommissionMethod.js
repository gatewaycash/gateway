import React, { useState } from 'react'
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select
} from '@material-ui/core'
import PropTypes from 'prop-types'

const CommissionMethod = ({
  onChange,
  showHelperText,
  SelectComponent,
  value,
  inputProps
}) => {
  const [valueState, setValue] = useState(value || 'address')
  SelectComponent = SelectComponent || Select
  return (
    <FormControl>
      <SelectComponent
        value={valueState}
        onChange={onChange || (ev => setValue(ev.target.value))}
        inputProps={{
          name: (inputProps && inputProps.name) || 'commissionMethod',
          ...inputProps
        }}
      >
        <MenuItem value="address">Address</MenuItem>
        <MenuItem value="XPUB">XPUB</MenuItem>
      </SelectComponent>
      {showHelperText !== false && (
        <FormHelperText>Commission Method</FormHelperText>
      )}
    </FormControl>
  )
}

CommissionMethod.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  showHelperText: PropTypes.bool,
  SelectComponent: PropTypes.func,
  inputProps: PropTypes.object
}

export default CommissionMethod
