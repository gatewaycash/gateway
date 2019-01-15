import React from 'react'
import PropTypes from 'prop-types'
import './Error.css'

let Error = ({error, closed = false, setClosed}) => {

  return !closed && error.error ? (
    <div className="errorBox">
      <div className="errorBox-inner">
        <span
          className="errorBox-close"
          onClick={() => setClosed(true)}
        >
          ×
        </span>
        <h4>{error.error}</h4>
        <p>{error.description}</p>
      </div>
    </div>
  ) : (
    <div></div>
  )
}

Error.propTypes = {
  error: PropTypes.object,
  closed: PropTypes.bool,
  setClosed: PropTypes.func
}

export default Error
