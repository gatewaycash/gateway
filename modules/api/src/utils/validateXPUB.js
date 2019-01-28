/**
 * Ensures an XPUB key is valid
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a function for validating XPUB keys
 * @param {string} XPUB - XPUB to check for validity
 * @param {object} res - Optional express response object for sending errors
 * @return {string|bool} - The XPUB key or false if invalid
 */
import bch from 'bitcore-lib-cash'
import { handleError } from 'utils'

export default (XPUB, res) => {
  if (!XPUB) return handleError(
    'No XPUB key',
    'An XPUB key is required',
    res
  )
  try {
    new bch.HDPublicKey(XPUB)
  } catch (e) {
    return handleError(
      'Invalid XPUB Key',
      'Make sure the BIP32 extended public key (XPUB) you provided is valid.',
      res
    )
  }
  return XPUB
}
