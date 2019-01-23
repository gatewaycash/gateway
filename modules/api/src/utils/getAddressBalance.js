/**
 * Returns the balance of a Bitcoin Cash address
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a function for discuvering address balances
 * @param {string} address - The address who's balance we are checking
 * @param {bool} unconfirmed - Whether to include unconfirmed transactions
 * @return Balance of the address or -1 if the query failed
 */
import axios from 'axios'
import bchaddr from 'bchaddrjs'
import { validateAddress } from 'utils'
import dotenv from 'dotenv'
dotenv.config()

export default async (address, unconfirmed = true) => {
  address = validateAddress(address)
  if (!address) return -1
  address = bchaddr.toLegacyAddress(address)
  let balance = 0
  try {
    let confirmedBalance = await axios.get(
      `${process.env.BLOCK_EXPLORER_BASE}/addr/${address}/balance`
    )
    balance += parseInt(confirmedBalance.data)
    if (unconfirmed) {
      let unconfirmedBalance = await axios.get(
        `${process.env.BLOCK_EXPLORER_BASE}/addr/${address}/unconfirmedbalance`
      )
      balance += parseInt(unconfirmedBalance.data)
    }
    return balance
  } catch (e) {
    return -1
  }
}
