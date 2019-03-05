import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core'
import styles from './style'
import { TextField, InputAdornment } from '@material-ui/core'

const InlineInput = ({
  InputProps,
  suffix,
  variant,
  classes,
  placeholder,
  value,
  onChange
}) => (
  <TextField
    value={value}
    placeholder={placeholder}
    className={
      variant === 'wide' ? classes.inline_input_wide : classes.inline_input
    }
    InputProps={{
      ...InputProps,
      endAdornment: (
        <InputAdornment
          position="end"
          classes={{ root: classes.inline_input_root }}
        >
          {suffix}
        </InputAdornment>
      ),
      classes: {
        input: classes.inline_input_inner
      }
    }}
    onChange={onChange}
  />
)

InlineInput.propTypes = {
  InputProps: PropTypes.object,
  suffix: PropTypes.string,
  variant: PropTypes.string,
  classes: PropTypes.object,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func
}

export default withStyles(styles)(InlineInput)
