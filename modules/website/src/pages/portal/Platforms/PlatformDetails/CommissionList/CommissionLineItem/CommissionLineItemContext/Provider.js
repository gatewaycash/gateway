import React, { useState } from 'react'
import Context from './Context'
import PropTypes from 'prop-types'

const ContextProvider = ({ children }) => {
  const [editable, setEditable] = useState(false)
  return (
    <Context.Provider value={{ editable, setEditable }}>
      {children}
    </Context.Provider>
  )
}

ContextProvider.propTypes = {
  children: PropTypes.any
}

export default ContextProvider
