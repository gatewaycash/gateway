/**
 * Exchange Rates Service
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Updates the exchange rates in the database every 10 minutes
 */
import { mysql } from 'utils'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

export default async () => {
  let currentRates = await mysql.query(
    'SELECT * FROM exchangeRates'
  )
  for (let i = 0; i < currentRates.length; i++) {
    let pair = currentRates[i].pair
    try {
      let exchangeRate = await axios.get(
        `https://apiv2.bitcoinaverage.com/indices/global/ticker/${pair}`
      )
      exchangeRate = exchangeRate.data.averages.day
      await mysql.query(
        'UPDATE exchangeRates SET rate = ? WHERE pair = ?',
        [exchangeRate, pair]
      )
    } catch (e) {
      console.error(`Unable to update exchange rate for ${pair}`)
    }
  }
}
