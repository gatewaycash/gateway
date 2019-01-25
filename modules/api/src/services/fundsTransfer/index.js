/**
 * Funds transfer daemon
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Provides a daemon for transfering funds
 */
import bch from 'bitcore-lib-cash'
import bchaddr from 'bchaddrjs'
import {
  mysql,
  getAddressBalance,
  executeCallback,
  validateAddress
} from 'utils'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

/**
 * Checks if apayment needs to be processed.
 * Calls processPayment or processXPUB if needed.
 * @param payment - The record from the payments table
 */
let checkPayment = async (payment) => {
  console.log(`Checking payment #${payment.tableIndex}...`)
  let balance = await getAddressBalance(payment.paymentAddress)
  if (balance <= 0) return
  if (payment.privateKey && payment.privateKey.toString().length > 1) {
    try {
      await processPayment(payment)
      console.log(`Successfully forwarded payment #${payment.tableIndex}`)
    } catch (e) {
      console.error(`Error with payment #${payment.tableIndex}`)
      console.error(e)
    }
  } else {
    try {
      await processXPUB(payment)
      console.log(`XPUB payment #${payment.tableIndex} finished!`)
    } catch (e) {
      console.error(`Error with XPUB payment #${payment.tableIndex}`)
      console.error(e)
    }
  }
}

/**
 * Processes a payment made to an XPUB address
 * @param {object} payment - The payment row in the payments table
 */
let processXPUB = async (payment) => {
  // Increment the totalSales of the merchant
  // This requires us to discover the amount from the TXID
  let TXIDs = await mysql.query(
    'SELECT TXID FROM transactions WHERE paymentIndex = ?',
    [payment.tableIndex]
  )

  /*
    This finds the actual value paid to the merchant's address and ignores any
    change outputs on the TXID that was submitted.
  */
  let paymentTotal = 0
  for (let i = 0; i < TXIDs.length; i++) {
    try {
      let result = await axios.get(
        `${process.env.BLOCK_EXPLORER_BASE}/tx/${TXIDs[i].TXID}`
      )
      for(let l = 0; l < result.data.vout.length; l++) {{
        let f = result.data.vout[l]
        if (f.scriptPubKey && f.scriptPubKey.addresses) {
          try {
            if (
              bchaddr.toCashAddress(f.scriptPubKey.addresses[0]) ===
              bchaddr.toCashAddress(payment.paymentAddress)
            ) {
              paymentTotal += f.value
            }
          } catch (e) {
            console.error(
              `Error converting addresses for XPUB payment
                #${payment.tableIndex}`
            )
            throw e
          }
        }
      }}
    } catch (e) {
      console.error(
        `Problem finding the value paid to XPUB payment #${payment.tableIndex}`
      )
      throw e
    }
  }

  // convert to satoshi
  paymentTotal *= 100000000

  // increment total sales of the merchant
  await mysql.query(
    'UPDATE users SET totalSales = totalSales + ? WHERE merchantID = ? LIMIT 1',
    [paymentTotal, payment.merchantID]
  )

  // execute the callback
  await executeCallback(payment)

  // mark payment as complete
  await mysql.query(
    'UPDATE payments SET status = ? WHERE tableIndex = ? LIMIT 1',
    ['complete', payment.tableIndex]
  )
}

/**
 * Forwards a payment to the merchant address
 * @param {object} payment - Payment row from the payments table
 */
let processPayment = async (payment) => {
  // get the payout address and contributions info for the merchant
  let merchant = await mysql.query(
    `SELECT payoutAddress,
      contributionPercentage,
      contributionCurrency,
      contributionAmount,
      contributionLessMore,
      username
      FROM users
      WHERE
        merchantID = ?
      LIMIT 1`,
    [payment.merchantID]
  )
  merchant = merchant[0]
  let merchantAddress = await validateAddress(merchant.payoutAddress)
  if (!merchantAddress) {
    console.error(
      `Could not validate merchant address for payment #${payment.tableIndex}`
    )
    throw 'Merchant address invalid'
  }

  // store a legacy version of paymentAddress
  let paymentAddressLegacy = bchaddr.toLegacyAddress(payment.paymentAddress)

  // find all UTXOs for paymentAddress
  let paymentUTXOs
  try {
    paymentUTXOs = await axios.get(
      `${process.env.BLOCK_EXPLORER_BASE}/addr/${paymentAddressLegacy}/utxo`
    )
    paymentUTXOs = paymentUTXOs.data
    console.log(
      `Found ${paymentUTXOs.length} UTXOs for payment #${payment.tableIndex}`
    )
    if (isNaN(paymentUTXOs.length) || paymentUTXOs.length <= 0) {
      console.error(`No UTXOs for payment #${payment.tableIndex}, aborting.`)
      return
    }
  } catch (e) {
    console.error(
      `Error finding UTXOs for payment #${payment.tableIndex}`
    )
    throw e
  }

  /*
    Create a BCH transaction spending paymentUTXOs to merchantAddress
    (and to Gateway if they elect to contribute)
   */
  let transferTransaction = new bch.Transaction()
  let totalTransferred = 0

  // the inputs for this transaction are from paymentUTXOs
  try {
    for(var i = 0, l = paymentUTXOs.length; i < l; i++) {
      transferTransaction.from({
        'txid': paymentUTXOs[i].txid,
        'vout': paymentUTXOs[i].vout,
        'address': bchaddr.toCashAddress(paymentUTXOs[i].address),
        'scriptPubKey': paymentUTXOs[i].scriptPubKey,
        'amount': paymentUTXOs[i].amount
      })
      totalTransferred += (paymentUTXOs[i].amount * 100000000)
    }
  } catch (e) {
    console.error(
      `Error adding inputs to the transaction in payment #${payment.tableIndex}`
    )
    throw e
  }

  // round the totalTransferred to be Satoshis
  totalTransferred = parseInt(totalTransferred)
  console.log(
    `Total inputs for payment #${payment.tableIndex}: ${(totalTransferred / 100000000)} BCH`
  )

  // build the outputs
  let amountContributed = 0
  try {

    /*
      This piece of code calculates amountContributed
    */
    let contributionPercentage =
      (merchant.contributionPercentage / 100) *
      totalTransferred
    let contributionAmount = merchant.contributionAmount
    if (merchant.contributionCurrency !== 'BCH') {
      let exchangeRate = await axios.get(
        `https://apiv2.bitcoinaverage.com/indices/global/ticker/BCH${merchant.contributionCurrency}`
      )
      exchangeRate = exchangeRate.data.averages.day
      contributionAmount *= (1 / exchangeRate)
      contributionAmount = parseInt(contributionAmount *= 100000000)
    }
    if (merchant.contributionLessMore === 'less') {
      amountContributed = (contributionPercentage < contributionAmount) ?
        contributionPercentage : contributionAmount
    } else {
      amountContributed = (contributionPercentage < contributionAmount) ?
        contributionAmount : contributionPercentage
    }

    // esure amountContributed is not greater than totalTransferred
    if (amountContributed + 1000 >= totalTransferred) {
      amountContributed = 0
      console.error(
        `In payment #${payment.tableIndex}, contribution is more than the payment amount itself. Contributing zero instead`
      )
    }

    // eliminate very small contributions
    if (amountContributed <= 1000) {
      amountContributed = 0
    }

    // log the contribution
    if (amountContributed > 0) {
      console.log(
        `Payment #${payment.tableIndex} from ${merchant.username} is contributing ${(amountContributed / 100000000)} BCH to Gateway!`
      )
    }

    // add the contribution to the transaction
    if (amountContributed > 0) {
      amountContributed = parseInt(amountContributed)
      transferTransaction.to(
        'bitcoincash:pz3txlyql9vc08px98v69a7700g6aecj5gc0q3xhng',
        parseInt(amountContributed)
      )
    }

    // TODO: platform commissions for platform merchant accounts
    // (code would go here)

    // a variable to hold the amount being sent to the merchant
    let merchantAmount =
      totalTransferred -
      amountContributed -
      (transferTransaction.inputs.length * 165) -
      ((transferTransaction.outputs.length + 1) * 35)
    merchantAmount = parseInt(merchantAmount)
    console.log(
      `Payment #${payment.tableIndex} forwards ${(merchantAmount / 100000000)} BCH to the merchant address`
    )

    // verify the merchant isn't getting dust
    if (merchantAmount < 600) {
      console.error(
        `Payment #${payment.tableIndex} merchant is getting dust, failing the payment`
      )
      await mysql.query(
        'UPDATE payments SET status = ? WHERE tableIndex = ? LIMIT 1',
        ['failed-dust', payment.tableIndex]
      )
      throw 'Dust is given to merchant'
    }

    // the merchant output
    transferTransaction.to(
      bchaddr.toCashAddress(merchantAddress),
      parseInt(merchantAmount)
    )

  } catch (e) {
    console.error(
      `Trouble adding outputs to transaction in payment #${payment.tableIndex}`
    )
    throw e
  }

  // sign the transaction
  try {
    transferTransaction.sign(bch.PrivateKey.fromWIF(payment.privateKey))
  } catch (e) {
    console.error(
      `Error signing transaction for payment #${payment.tableIndex}`
    )
    throw e
  }

  /*
    Broadcast transaction to multiple places
  */
  let rawTransferTransaction = transferTransaction.toString()
  console.log(rawTransferTransaction)

  // Our current block explorer
  let transferTXID = await axios.post(
    `${process.env.BLOCK_EXPLORER_BASE}/tx/send`,
    {
      rawtx: rawTransferTransaction
    }
  )
  transferTXID = transferTXID.data.txid

  // log the broadcast
  console.log(
    `Payment #${payment.tableIndex} broadcasted! TXID: ${transferTXID}`
  )

  // Blockchair.com block explorer
  await axios.post(
    'https://api.blockchair.com/bitcoin-cash/push/transaction',
    {
      data: rawTransferTransaction
    }
  )

  // insert the transaction into the transactions table
  await mysql.query(
    'INSERT INTO transactions (TXID, paymentIndex, type) VALUES (?, ?, ?)',
    [transferTXID, payment.tableIndex, 'transfer-to-merchant']
  )

  // mark payment as complete
  await mysql.query(
    'UPDATE payments SET status = ? WHERE tableIndex = ? LIMIT 1',
    ['complete', payment.tableIndex]
  )

  // increment the total sales of the merchant
  await mysql.query(
    `UPDATE users
      SET
        totalSales =
          totalSales + ?,
        contributionTotal =
          contributionTotal + ?
      WHERE
        merchantID = ?
      LIMIT 1`,
    [totalTransferred, amountContributed, merchant.merchantID]
  )

  // execute a callback
  await executeCallback(payment)
}


export default async () => {
  let pendingPayments = await mysql.query(
    'SELECT * FROM payments WHERE status = ?',
    ['pending']
  )
  for (let i = 0; i < pendingPayments.length; i++) {
    await checkPayment(pendingPayments[i])
  }
}
