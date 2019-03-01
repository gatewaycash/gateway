import React, { useState } from 'react'
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select
} from '@material-ui/core'
import PropTypes from 'prop-types'

const CommissionLessMore = ({
  classes,
  onChange,
  showHelperText,
  SelectComponent,
  inputProps,
  value
}) => {
  const [valueState, setValue] = useState(value || 'more')
  SelectComponent = SelectComponent || Select
  return (
    <FormControl>
      <SelectComponent
        value={valueState}
        onChange={onChange || (ev => setValue(ev.target.value))}
        inputProps={{
          name: (inputProps && inputProps.name) || 'commissionLessMore',
          ...inputProps
        }}
      >
        <MenuItem value="more">More</MenuItem>
        <MenuItem value="less">Less</MenuItem>
      </SelectComponent>
      {showHelperText !== false && (
        <FormHelperText classes={classes}>
          Charge the lesser or greater commission fee (of percent or flat fee)
        </FormHelperText>
      )}
    </FormControl>
  )
}

CommissionLessMore.propTypes = {
  classes: PropTypes.object,
  onChange: PropTypes.func,
  value: PropTypes.string,
  showHelperText: PropTypes.bool,
  SelectComponent: PropTypes.func,
  inputProps: PropTypes.object
}

export default CommissionLessMore
