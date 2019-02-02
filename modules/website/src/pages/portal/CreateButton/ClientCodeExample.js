import React from 'react'
import { Text, SourceCode } from 'components'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import PropTypes from 'prop-types'

const ClientCode = ({ rawButtonHtml }) => (
  <Card>
    <CardContent>
      <h2>Generated Code</h2>
      <Text>
        Add this line of HTML once on each page you want to accept payments on:
      </Text>
      <SourceCode>
        {'<script src="https://gateway.cash/pay.js"></script>'}
      </SourceCode>
      <Text>
        Add this code wherever you want to place a payment button. You can put
        as many buttons on the same page as you'd like:
      </Text>
      <SourceCode>{rawButtonHtml}</SourceCode>
      <Text>
        Feel free to change any of the values in the above code block except
        your merchant ID, which is how you'll get paid.
      </Text>
    </CardContent>
  </Card>
)

ClientCode.propTypes = {
  rawButtonHtml: PropTypes.string
}

export default ClientCode
