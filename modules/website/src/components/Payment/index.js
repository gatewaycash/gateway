import React from 'react'
import PropTypes from 'prop-types'
import './payment.css'
import { Text } from 'components'

let Payment = ({
  paymentAddress,
  paymentTXID,
  transferTXID,
  paymentID,
  callbackURL,
  paidAmount,
  paymentKey
}) => (
  <div className="payment">
    <Text><b>Payment Address: </b>
      <a
        href={'https://explorer.bitcoin.com/bch/address/' + paymentAddress}
      >
        {paymentAddress}
      </a>
    </Text>
    <Text>
      <b>Amount: </b>{(paidAmount / 100000000) + ' BCH' || '0 BCH'}
    </Text>
    <Text><b>Payment TXID: </b>
      {
        paymentTXID ?
          <a
            href={'https://explorer.bitcoin.com/bch/tx/' + paymentTXID}
          >
            {paymentTXID}
          </a>
          : 'No payment TXID'
      }
    </Text>
    <Text><b>Transfer TXID: </b>
      {
        transferTXID ?
          <a
            href={'https://explorer.bitcoin.com/bch/tx/' + transferTXID}
          >
            {transferTXID}
          </a>
          : 'No transfer TXID'
      }
    </Text>
    <Text><b>Private Key: </b>{paymentKey}</Text>
    <Text><b>Payment ID: </b>{paymentID || 'No Payment ID'}</Text>
    <Text><b>Callback URL: </b>
      {callbackURL.length > 1 ? callbackURL : 'No callback URL'}
    </Text>
  </div>
)

Payment.propTypes = {
  paymentAddress: PropTypes.string,
  paymentTXID: PropTypes.string,
  transferTXID: PropTypes.string,
  paymentID: PropTypes.string,
  callbackURL: PropTypes.string,
  paidAmount: PropTypes.any,
  paymentKey: PropTypes.string
}

export default Payment
