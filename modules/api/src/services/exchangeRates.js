/**
 * Exchange Rates Service
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Updates the exchange rates in the database every 10 minutes
 */
import { mysql } from 'utils'
import axios from 'axios'

export default async () => {
  let currentRates = await mysql.query(
    'SELECT * FROM exchangeRates'
  )
  for (let i = 0; i < currentRates.length; i++) {
    let pair = currentRates[i].pair
    try {
      let exchangeRate = await axios.get(
        `https://api.coinbase.com/v2/prices/${pair}/spot`
      )
      exchangeRate = exchangeRate.data.data.amount
      await mysql.query(
        'UPDATE exchangeRates SET rate = ? WHERE pair = ?',
        [exchangeRate, pair]
      )
    } catch (e) {
      console.error(`Unable to update exchange rate for ${pair}`)
      console.error(e)
    }
  }
}
