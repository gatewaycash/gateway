exports.up = async knex => {
  await knex('exchangeRates')
    .where('pair', '=', 'BCHUSD')
    .update({
      pair: 'BCH-USD'
    })

  await knex('exchangeRates')
    .where('pair', '=', 'BCHEUR')
    .update({
      pair: 'BCH-EUR'
    })

  await knex('exchangeRates')
    .where('pair', '=', 'BCHCNY')
    .update({
      pair: 'BCH-CNY'
    })

  await knex('exchangeRates')
    .where('pair', '=', 'BCHJPY')
    .update({
      pair: 'BCH-JPY'
    })
}

exports.down = async knex => {
  await knex('exchangeRates')
    .where('pair', '=', 'BCH-USD')
    .update({
      pair: 'BCHUSD'
    })

  await knex('exchangeRates')
    .where('pair', '=', 'BCH-EUR')
    .update({
      pair: 'BCHEUR'
    })

  await knex('exchangeRates')
    .where('pair', '=', 'BCH-CNY')
    .update({
      pair: 'BCHCNY'
    })

  await knex('exchangeRates')
    .where('pair', '=', 'BCH-JPY')
    .update({
      pair: 'BCHJPY'
    })
}