/**
 * Forwards a payment to the merchant address
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a function for processing payments
 * @param {object} payment - Payment row from the payments table
 */
import { mysql, validateAddress, executeCallback } from 'utils'
import bchaddr from 'bchaddrjs'
import axios from 'axios'
import bch from 'bitcore-lib-cash'
import dotenv from 'dotenv'
dotenv.config()

export default async (payment) => {
  // get the payout address and contributions info for the merchant
  let merchant = await mysql.query(
    `SELECT payoutAddress,
      contributionPercentage,
      contributionCurrency,
      contributionAmount,
      contributionLessMore,
      username,
      tableIndex,
      platformIndex
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
    } else {
      contributionAmount = contributionAmount * 100000000
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

    /*
      platform commissions for platform merchant accounts
    */
    let allCommissionsTotal = 0
    // check if this merchant account belongs to a platform (managed account)
    if (merchant.platformIndex != 0) {
      // find all commissions of this platform
      let commissions = await mysql.query(
        'SELECT * FROM commissions WHERE platformIndex = ?',
        [merchant.platformIndex]
      )

      // for each commission, create an output fulfilling the commission
      for (let i = 0; i < commissions.length; i++) {

        /*
          This piece of code calculates amountCommissioned
        */
        let commissionPercentage =
          (commissions[i].commissionPercentage / 100) *
          totalTransferred
        let commissionAmount = commissions[i].commissionAmount
        if (commissions[i].commissionCurrency !== 'BCH') {
          let exchangeRate = await axios.get(
            `https://apiv2.bitcoinaverage.com/indices/global/ticker/BCH${commissions[i].commissionCurrency}`
          )
          exchangeRate = exchangeRate.data.averages.day
          commissionAmount *= (1 / exchangeRate)
          commissionAmount = parseInt(commissionAmount *= 100000000)
        } else {
          commissionAmount = commissionAmount * 100000000
        }
        let amountCommissioned
        if (commissions[i].commissionLessMore === 'less') {
          amountCommissioned = (commissionPercentage < commissionAmount) ?
            commissionPercentage : commissionAmount
        } else {
          amountCommissioned = (commissionPercentage < commissionAmount) ?
            commissionAmount : commissionPercentage
        }

        // esure amountContributed is not greater than totalTransferred
        if (
          amountCommissioned + 1000 >=
          (totalTransferred - amountContributed)
        ) {
          amountCommissioned = 0
          console.error(
            `In payment #${payment.tableIndex}, commission #${commissions[i].tableIndex} is more than the payment amount minus the Gateway contribution itself. Taking zero commission instead.`
          )
        }

        // eliminate very small contributions
        if (amountCommissioned <= 1000) {
          continue
        }

        // log the commission
        console.log(
          `Payment #${payment.tableIndex} is subject to commission #${commissions[i].tableIndex}, which in this case is ${(amountCommissioned / 100000000)} BCH`
        )

        // now that we know amountCommissioned, we need to know where to send it
        // this code finds that out
        let commissionAddress
        if (commissions[i].commissionMethod === 'XPUB') {
          try {
            let hdPub = new bch.HDPublicKey(commissions[i].commissionXPUB)
            let derivedKey = hdPub.derive(0).derive(commissions[i].XPUBIndex)
            let paymentPublicKey = new bch.PublicKey(derivedKey.publicKey)
            let address = new bch.Address(paymentPublicKey)
            commissionAddress = bchaddr.toCashAddress(
              address.toString()
            )
          } catch (e) {
            console.error(
              `Payment #${payment.tableIndex} commission #${commissions[i].tableIndex} XPUB key address derivation error`
            )
            throw e
          }
        } else {
          commissionAddress = commissions[i].commissionAddress
        }

        // finally, we build the commission output
        transferTransaction.to(
          commissionAddress,
          amountCommissioned
        )

        // add the commission to allCommissionsTotal
        allCommissionsTotal += amountCommissioned

        // increment the XPUB counter if needed
        if (commissions[i].commissionMethod === 'XPUB') {
          await mysql.query(
            `UPDATE commissions
              SET XPUBIndex = XPUBIndex + 1
              WHERE tableIndex = ?
              LIMIT 1`,
            [commissions[i].tableIndex]
          )
        }

      } // commissions for loop

    } // account belongs to platform

    // a variable to hold the amount being sent to the merchant
    // the transaction fee is calculated and subtracted here
    let merchantAmount =
      totalTransferred -
      amountContributed -
      allCommissionsTotal -
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
        tableIndex = ?
      LIMIT 1`,
    [totalTransferred, amountContributed, merchant.tableIndex]
  )

  // increment totalSales of the platform if the user belongs to a platform
  if (merchant.platformIndex !== 0) {
    await mysql.query(
      `UPDATE platforms
        SET totalSales = totalSales + ?
        WHERE tableIndex = ?
        LIMIT 1`,
      [totalTransferred, merchant.tableIndex]
    )

  }

  // execute a callback
  await executeCallback(payment)
}
