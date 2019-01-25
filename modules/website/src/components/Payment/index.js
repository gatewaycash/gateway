import React from 'react'
import PropTypes from 'prop-types'
import './payment.css'
import { Text } from 'components'

let Payment = ({
  paymentAddress,
  paymentID,
  callbackURL,
  callbackStatus,
  invoiceAmount,
  privateKey,
  created,
  transactions
}) => (
  <div className="payment">
    <div className="payment-inner">
      <Text><b>Payment Address: </b>
        <a
          href={'https://explorer.bitcoin.com/bch/address/' + paymentAddress}
        >
          {paymentAddress}
        </a>
      </Text>
      {
        invoiceAmount &&
        <Text>
          <b>Invoice Amount: </b>{(invoiceAmount / 100000000) + ' BCH'}
        </Text>
      }
      {
        (privateKey && privateKey !== 'hidden') &&
        <Text><b>Private Key: </b>{privateKey}</Text>
      }
      {
        (paymentID && paymentID.length > 1) &&
        <Text><b>Payment ID: </b>{paymentID}</Text>
      }
      {
        (callbackURL && callbackURL.length > 1) &&
        <Text><b>Callback URL: </b>{callbackURL}</Text>
      }
      {
        (callbackStatus && callbackStatus.length > 1) &&
        <Text><b>Callback Status: </b>{callbackStatus}</Text>
      }
      <Text><b>Invoice Created: </b>{created}</Text>
      {
        (transactions && transactions.length > 0) &&
        transactions.map((t, k) => (
          <div className="payment-transaction" key={k}>
            <Text><b>Transaction Type: </b>{t.type}</Text>
            <Text><b>TXID: </b>
              <a
                href={'https://explorer.bitcoin.com/bch/tx/' + t.TXID}
              >
                {t.TXID}
              </a>
            </Text>
          </div>
        ))
      }
    </div>
  </div>
)

Payment.propTypes = {
  paymentAddress: PropTypes.string,
  paymentID: PropTypes.string,
  callbackURL: PropTypes.string,
  callbackStatus: PropTypes.string,
  invoiceAmount: PropTypes.any,
  privateKey: PropTypes.string,
  created: PropTypes.string,
  transactions: PropTypes.any
}

export default Payment
