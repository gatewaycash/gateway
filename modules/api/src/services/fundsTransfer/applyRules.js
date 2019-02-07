/**
 * Applies rules and calculates an amount based on given rules
 * @license AGPL-3.0
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a function for calculating amounts based on rules
 * @param {number} paymentIndex - The table index of the payment
 * @param {number} paymentTotal - The total of the inputs for the payment
 * @param {string} ruleAmount - The rule amount (in units of ruleCurrency)
 * @param {string} ruleCurrency - The currency code (BCH, USD, EUR, CNY, JPY)
 * @param {string} rulePercentage - The percentage for the rule (25 for 25%)
 * @param {string} ruleLessMore - Whether the lesser or greater should be used
 * @param {string} ruleMinTotal - Min (in ruleCurrency) when the rule applies
 * @param {string} ruleMaxTotal - Max (in ruleCurrency) when the rule applies
 * @param {string} ruleMinDeduct - Minimum to charge if the rule applies
 * @param {string} ruleMaxDeduct - Maximum to charge if the rule applies
 * @param {string} ruleIDRegex - Regex must match paymentID for rule to apply
 * @param {string} paymentID - paymentID column from payments table
 * @return {number} The amount to charge for this rule in satoshi
 */
import { mysql } from 'utils'

export default async (
  paymentIndex,
  paymentTotal,
  ruleAmount,
  ruleCurrency,
  rulePercentage,
  ruleLessMore,
  ruleMinTotal,
  ruleMaxTotal,
  ruleMinDeduct,
  ruleMaxDeduct,
  ruleIDRegex,
  paymentID
) => {
  /*
    Pre-flight checks
  */

  // Check if paymentIndex was given
  if (!paymentIndex) {
    paymentIndex = 'U-' + Math.round(Math.random() * 1000000)
    console.log(
      `No payment index provided to apply rules function, using #${paymentIndex}`
    )
  }

  // Retrieve an exchange rate from the database
  let exchangeRate = 1
  if (ruleCurrency !== 'BCH') {
    exchangeRate = await mysql.query(
      'SELECT rate FROM exchangeRates WHERE pair = ?',
      ['BCH' + ruleCurrency]
    )
    if (exchangeRate.length !== 1) {
      console.error(
        `Unknown currency for payment #${paymentIndex}: ${ruleCurrency}`
      )
      throw 'Unknown currency'
    }
    exchangeRate = exchangeRate[0].rate
  }

  // assign default values for ruleMinTotal, ruleMaxTotal, ruleMinDeduct,
  // ruleMaxDeduct
  ruleMinTotal = ruleMinTotal || 0
  ruleMaxTotal = ruleMaxTotal || 2100000000000000
  ruleMinDeduct = ruleMinDeduct || 0
  ruleMaxDeduct = ruleMaxDeduct || 2100000000000000

  // ensure paymentTotal is between ruleMinTotal and ruleMaxTotal
  // (in terms of ruleCurrency)
  if (
    paymentTotal < ruleMinTotal * (1 / exchangeRate) ||
    paymentTotal > ruleMaxTotal * (1 / exchangeRate)
  ) {
    return 0
  }

  // if ruleRegex was provided, ensure it matches with the paymentID
  if (ruleIDRegex && !ruleIDRegex.match(paymentID)) {
    return 0
  }

  /*
    Calculations
  */

  // a variable to store the calculated amount in satoshi
  let calculatedAmount = 0

  // if we were to use the percentage value, find out what it would be
  let percentageValue = (rulePercentage / 100) * paymentTotal

  // if we were to use the (amount * currency), find what it would be
  let amountValue = ruleAmount * (1 / exchangeRate) * 100000000

  // find and use the lesser or the greater of the two values and use it
  if (ruleLessMore === 'less') {
    calculatedAmount = (percentageValue < amountValue) ?
      percentageValue : amountValue
  } else {
    calculatedAmount = (percentageValue > amountValue) ?
      percentageValue : amountValue
  }

  /*
    Post-flight checks
  */

  // ensure the amount is greater than ruleMinDeduct (in ruleCurrency)
  if (calculatedAmount < ruleMinDeduct * (1 / exchangeRate)) {
    calculatedAmount = ruleMinDeduct * (1 / exchangeRate)
  }

  // ensure the amount is less than ruleMaxDeduct (in ruleCurrency)
  if (calculatedAmount > ruleMaxDeduct * (1 / exchangeRate)) {
    calculatedAmount = ruleMaxDeduct * (1 / exchangeRate)
  }

  // calculatedAmount cannot exceed (paymentTotal - fees and a dust output)
  if (calculatedAmount + 2000 > paymentTotal) {
    calculatedAmount = paymentTotal - 2000
  }

  // calculatedAmount cannot be negative (especially after the above operation)
  // or dust (less than about 600 satoshi)
  if (calculatedAmount < 600) {
    return 0
  }

  // return the calculated amount based on the rules
  return parseInt(calculatedAmount)
}
