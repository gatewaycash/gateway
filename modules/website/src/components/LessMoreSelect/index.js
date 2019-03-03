import React, { useState, useMemo } from 'react'
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select
} from '@material-ui/core'
import PropTypes from 'prop-types'

const LessMoreSelect = ({
  classes,
  onChange,
  helperText,
  SelectComponent,
  inputProps,
  value,
  lessText,
  moreText,
  helperTextClasses,
  selectClasses
}) => {
  const [valueState, setValue] = useState(value || 'more')
  useMemo(() => setValue(value), [value])
  SelectComponent = SelectComponent || Select
  lessText = lessText || 'Less'
  moreText = moreText || 'More'
  return (
    <FormControl classes={classes}>
      <SelectComponent
        value={valueState}
        onChange={onChange || (ev => setValue(ev.target.value))}
        inputProps={inputProps}
        classes={selectClasses}
      >
        <MenuItem value="more">{moreText}</MenuItem>
        <MenuItem value="less">{lessText}</MenuItem>
      </SelectComponent>
      {helperText && (
        <FormHelperText classes={helperTextClasses}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  )
}

LessMoreSelect.propTypes = {
  classes: PropTypes.object,
  onChange: PropTypes.func,
  value: PropTypes.string,
  helperText: PropTypes.string,
  SelectComponent: PropTypes.func,
  inputProps: PropTypes.object,
  lessText: PropTypes.string,
  moreText: PropTypes.string,
  helperTextClasses: PropTypes.object,
  selectClasses: PropTypes.object
}

export default LessMoreSelect
