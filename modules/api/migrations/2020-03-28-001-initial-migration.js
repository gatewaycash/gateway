/**
 * Knex Migration
 * Name: Initial Migration
 * This migration adds tables that were being actively used in the old
 * production database as of 3/28/2020. The next migration defines the
 * rest of the schema.
 * @author The Gateway Project Developers <hello@gateway.cash>
 */

exports.up = async knex => {
  if (!(await knex.schema.hasTable('users'))) {
    await knex.schema.createTable('users', table => {
      table.increments('userID').primary()
      table.string('payoutAddress', 60)
      table.integer('totalSales', 15).defaultsTo(0)
      table.timestamp('created').defaultTo(knex.fn.now()).notNullable()
      table.timestamp('lastPayout')
      table.string('merchantID', 16)
      table.string('password', 256)
      table.string('salt', 256)
      table.string('username', 24)
      table.string('APIKey', 32)
    })
  }
  if (!(await knex.schema.hasTable('transactions'))) {
    await knex.schema.createTable('transactions', table => {
      table.increments('tableIndex').primary()
      table.timestamp('created').defaultTo(knex.fn.now()).notNullable()
      table.string('type', 30).defaultTo('payment')
      table.string('TXID', 64)
      table.integer('paymentIndex', 8)
    })
  }
  if (!(await knex.schema.hasTable('exchangeRates'))) {
    await knex.schema.createTable('exchangeRates', table => {
      table.increments('tableIndex').primary()
      table.string('pair', 10)
      table.string('rate', 30)
    })
  }
  if (!(await knex.schema.hasTable('payments'))) {
    await knex.schema.createTable('payments', table => {
      table.increments('paymentIndex').primary()
      table.string('paymentAddress', 60)
      table.integer('paidAmount', 15).defaultTo(0)
      table.timestamp('created').defaultTo(knex.fn.now()).notNullable()
      table.string('paymentID', 32)
      table.string('merchantID', 16)
      table.string('paymentKey', 80)
      table.string('paymentTXID', 64)
      table.string('transferTXID', 64)
      table.string('callbackURL', 128)
    })
  }
  if (!(await knex.schema.hasTable('pending'))) {
    await knex.schema.createTable('pending', table => {
      table.timestamp('created').defaultTo(knex.fn.now()).notNullable()
      table.string('address', 60)
      table.string('txid', 64)
    })
  }
}

exports.down = async knex => {
  if (await knex.schema.hasTable('users')) {
    await knex.schema.dropTable('users')
  }
  if (await knex.schema.hasTable('transactions')) {
    await knex.schema.dropTable('transactions')
  }
  if (await knex.schema.hasTable('exchangeRates')) {
    await knex.schema.dropTable('exchangeRates')
  }
  if (await knex.schema.hasTable('payments')) {
    await knex.schema.dropTable('payments')
  }
  if (await knex.schema.hasTable('pending')) {
    await knex.schema.dropTable('pending')
  }
}