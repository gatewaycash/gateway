import React from 'react'
import PropTypes from 'prop-types'
import './payment.css'

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
      <p><b>Payment Address: </b>
        <a
          href={'https://explorer.bitcoin.com/bch/address/' + paymentAddress}
        >
          {paymentAddress}
        </a>
      </p>
      {
        invoiceAmount &&
        <p>
          <b>Invoice Amount: </b>{(invoiceAmount / 100000000) + ' BCH'}
        </p>
      }
      {
        (privateKey && privateKey !== 'hidden') &&
        <p><b>Private Key: </b>{privateKey}</p>
      }
      {
        (paymentID && paymentID.length > 1) &&
        <p><b>Payment ID: </b>{paymentID}</p>
      }
      {
        (callbackURL && callbackURL.length > 1) &&
        <p><b>Callback URL: </b>{callbackURL}</p>
      }
      {
        (callbackStatus && callbackStatus.length > 1) &&
        <p><b>Callback Status: </b>{callbackStatus}</p>
      }
      <p><b>Invoice Created: </b>{created}</p>
      {
        (transactions && transactions.length > 0) &&
        transactions.map((t, k) => (
          <div className="payment-transaction" key={k}>
            <p><b>Transaction Type: </b>{t.type}</p>
            <p><b>TXID: </b>
              <a
                href={'https://explorer.bitcoin.com/bch/tx/' + t.TXID}
              >
                {t.TXID}
              </a>
            </p>
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
