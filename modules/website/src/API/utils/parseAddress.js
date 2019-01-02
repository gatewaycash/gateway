import bchaddr from 'bchaddrjs'

// returns a CashAddress translated address, or false if address is invalid
export default (address) => {
  try {
    return bchaddr.toCashAddress(address)
  } catch (e) {
    return false
  }
}
