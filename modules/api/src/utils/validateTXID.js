/**
 * Checks a given TXID for validity
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Validates TXIDs
 */
import { handleError } from 'utils'

export default (TXID, res) => {

  if (!TXID) {
    return handleError(
      'No TXID',
      'A TXID is required.',
      res
    )
  }

  if (typeof TXID !== 'string' || TXID.match(/^[a-f0-9]{64}$/) === null) {
    return handleError(
      'Invalid TXID',
      'TXIDs are unique, 64-character identifiers for Bitcoin transactions. Ensure the TXID is correct and that you copied the TXID correctly.',
      res
    )
  }

  return TXID.toString().toLowerCase()
}
