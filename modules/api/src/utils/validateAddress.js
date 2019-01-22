/**
 * Ensures an address is valid and translates to CashAddress if needed
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a function for validating Bitcoin Cash addresses
 * @param {string} address - Address to check for validity
 * @param {object} res - Optional express response object for sending errors
 * @return {string|bool} - The correct address or false if address was invalid
 */
import bchaddr from 'bchaddrjs'
import { handleError } from 'utils'

export default (address, res) => {
  if (!address) return handleError(
    'No Address',
    'No address was provided',
    res
  )
  try {
    address = bchaddr.toCashAddress(address)
    return address
  } catch (e) {
    return handleError(
      'Invalid Address',
      'Make sure the address you provided is a valid Bitcoin Cash (BCH) address. You can get a Bitcoin Cash address from the Bitcoin.com wallet (searcch your app store) or from any other Bitcoin Cash wallet. Your address should usually start with "bitcoincash:q..." or sometimes just "q", and it should be around 20-30 characters long.',
      res
    )
  }
}
