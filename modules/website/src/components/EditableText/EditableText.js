import React, { useState } from 'react'
import { TextField } from '@material-ui/core'
import PropTypes from 'prop-types'
import { Context } from './EditableTextContext'

const EditableText = ({ children, EditComponent, value, TextFieldProps }) => {
  const [valueState, setValue] = useState(value || '')
  return (
    <Context.Consumer>
      {context => {
        if (!context.editable && value !== valueState) {
          setValue(value)
        }
        return context.editable ? (
          EditComponent ? (
            <EditComponent>{children}</EditComponent>
          ) : (
            <TextField
              {...TextFieldProps}
              type="text"
              value={valueState}
              variant="outlined"
              InputProps={{
                ...TextFieldProps.InputProps,
                onChange: ev => setValue(ev.target.value)
              }}
            />
          )
        ) : (
          children
        )
      }}
    </Context.Consumer>
  )
}

EditableText.propTypes = {
  children: PropTypes.any,
  classes: PropTypes.object,
  align: PropTypes.string,
  EditComponent: PropTypes.any,
  name: PropTypes.string,
  value: PropTypes.any,
  doSave: PropTypes.bool,
  InputProps: PropTypes.object,
  TextFieldProps: PropTypes.object
}

export default EditableText
