import React, { useState } from 'react'
import Context from './Context'
import PropTypes from 'prop-types'

const ContextProvider = ({ children }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [deleteButton, setDeleteButton] = useState(false)

  return (
    <Context.Provider
      value={{ isEditing, setIsEditing, deleteButton, setDeleteButton }}
    >
      {children}
    </Context.Provider>
  )
}

ContextProvider.propTypes = {
  children: PropTypes.any
}

export default ContextProvider
