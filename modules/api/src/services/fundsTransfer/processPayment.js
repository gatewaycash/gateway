/**
 * Forwards a payment to the merchant address
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a function for processing payments
 * @param {object} payment - Payment row from the payments table
 */
import { mysql, executeCallback } from 'utils'
import broadcastTransaction from './broadcastTransaction'
import applyRules from './applyRules'
import bchaddr from 'bchaddrjs'
import axios from 'axios'
import bch from 'bitcore-lib-cash'
import dotenv from 'dotenv'
dotenv.config()

export default async (payment) => {
  // Get the merchant record
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

  // find all UTXOs for paymentAddress
  let paymentUTXOs
  try {
    paymentUTXOs = await axios.get(
      `${process.env.BLOCK_EXPLORER_BASE}/addr/${bchaddr.toLegacyAddress(payment.paymentAddress)}/utxo`
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
    Create a Transaction and add the inputs
  */
  let transferTransaction = new bch.Transaction()
  let totalTransferred = 0
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

  /*
    Add outputs to the transaction
  */

  // store the amount contributed for later insertion into the database
  // (and calculating the transaction fee)
  let amountContributed = 0

  try {

    /*
      Gateway Contributions
    */

    amountContributed = await applyRules(
      payment.tableIndex,
      totalTransferred,
      merchant.contributionAmount,
      merchant.contributionCurrency,
      merchant.contributionPercentage,
      merchant.contributionLessMore
    )
    if (amountContributed > 0) {
      // log the contribution
      console.log(
        `Payment #${payment.tableIndex} from ${merchant.username} is contributing ${(amountContributed / 100000000)} BCH to Gateway!`
      )
      // add the contribution to the transaction
      transferTransaction.to(
        'bitcoincash:pz3txlyql9vc08px98v69a7700g6aecj5gc0q3xhng',
        amountContributed
      )
    }

    /*
      Platform Commissions
    */

    // store the total of all commissions for calculating the transaction fee
    let allCommissionsTotal = 0

    // check if this merchant account belongs to a platform (managed account)
    if (merchant.platformIndex != 0) {

      // find all commissions of this platform
      let commissions = await mysql.query(
        'SELECT * FROM commissions WHERE platformIndex = ?',
        [merchant.platformIndex]
      )

      // for each commission, create an output fulfilling the commission
      // (as long as there is enough money left to keep going)
      for (let i = 0; i < commissions.length; i++) {
        let amountCommissioned = await applyRules(
          payment.tableIndex,
          totalTransferred, // (totalTransferred - amountContributed)
          commissions[i].commissionAmount,
          commissions[i].commissionCurrency,
          commissions[i].commissionPercentage,
          commissions[i].commissionLessMore
        )

        // log the commission
        console.log(
          `Payment #${payment.tableIndex} is subject to commission #${commissions[i].tableIndex}, which in this case is ${(amountCommissioned / 100000000)} BCH`
        )

        // if this commission would overspend the transaction, we leave it out
        if (
          allCommissionsTotal +
          amountCommissioned +
          amountContributed +
          2000 >
          totalTransferred
        ) {
          console.log(
            `In payment #${payment.tableIndex}, commission #${commissions[i].tableIndex} would over-spend the transaction. Leaving it out.`
          )
          continue
        }

        // Derive XPUB address if needed
        let commissionAddress = commissions[i].commissionAddress
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
    if (merchantAmount < 546) {
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
      bchaddr.toCashAddress(merchant.payoutAddress),
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

  // broadcast the transaction
  let transferTXID
  try {
    transferTXID = await broadcastTransaction(
      transferTransaction,
      payment.tableIndex
    )
  } catch (e) {
    console.error(
      'Error broadcasting transaction'
    )
    throw e
  }

  // log the transfer transaction broadcast
  console.log(
    `Payment #${payment.tableIndex} broadcasted!\nTXID: ${transferTXID}`
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
      [totalTransferred, merchant.platformIndex]
    )
  }

  // execute a callback
  await executeCallback(payment)
}
