import React from 'react'
import PayButton from '@gatewaycash/paybutton'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import PropTypes from 'prop-types'

let PreviewButton = ({ buttonProperties }) => (
  <Card>
    <CardContent>
      <h2>Button Preview</h2>
      <p>
        This is what your finished button will look like and how it will behave.
        Payments made to the button on this page will be sent to your address.
      </p>
      <center>
        <PayButton
          {...buttonProperties}
          gatewayServer={process.env.REACT_APP_GATEWAY_BACKEND}
        />
      </center>
    </CardContent>
  </Card>
)

PreviewButton.propTypes = {
  buttonProperties: PropTypes.object
}

export default PreviewButton
