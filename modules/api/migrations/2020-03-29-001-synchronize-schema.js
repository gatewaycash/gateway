/**
 * Knex Migration
 * Name: Synchronize Schema
 * The previous migration defined the old production schema. This migration
 * brings it insync with the implementation in the current codebase as of
 * 3/29/2020.
 * @author The Gateway developers <hello@gateway.cash>
 */

exports.up = async knex => {
  await knex.schema.raw(
    'ALTER TABLE users CHANGE userID tableIndex int unsigned AUTO_INCREMENT'
  )
  await knex.schema.table('users', table => {
    table.renameColumn('password', 'passwordHash')
    table.renameColumn('salt', 'passwordSalt')
    table.string('payoutXPUB', 115)
    table.integer('XPUBIndex', 8).defaultTo(0)
    table.string('payoutMethod', 10).defaultTo('address')
    table.string('nativeCurrency', 3).defaultTo('BCH')
    table.string('contributionPercentage', 6).defaultTo('0.00')
    table.string('contributionAmount', 8).defaultTo('0.00')
    table.string('contributionCurrency', 3).defaultTo('BCH')
    table.string('contributionLessMore', 4).defaultTo('less')
    table.string('contributionTotal', 15).defaultTo(0)
    table.integer('platformIndex', 8).defaultTo(0)
  })
  await knex.schema.raw(
    'ALTER TABLE payments CHANGE paymentIndex tableIndex int unsigned AUTO_INCREMENT'
  )
  await knex.schema.table('payments', table => {
    table.renameColumn('paymentKey', 'privateKey')
    table.string('callbackStatus', 30).defaultTo('')
    table.integer('invoiceAmount', 15).defaultTo(0)
    table.string('status', 30).defaultTo('clicked')
    table.string('platformID', 16).defaultTo('')
    table.integer('processingAttempts', 3).defaultTo(0)
    table.dropColumns('paymentTXID', 'transferTXID')
  })
  await knex.schema.raw(
    'ALTER TABLE payments MODIFY COLUMN privateKey varchar(80) DEFAULT ""'
  )
  await knex.schema.raw(
    'ALTER TABLE payments MODIFY COLUMN callbackURL varchar(250)'
  )
  await knex.schema.raw(
    'ALTER TABLE payments MODIFY COLUMN paymentID varchar(64)'
  )
  await knex.schema.createTable('APIKeys', table => {
    table.increments('tableIndex').primary()
    table.timestamp('created').defaultTo(knex.fn.now())
    table.integer('active', 1).defaultTo(1)
    table.timestamp('revocationDate').nullable()
    table.integer('userIndex').unsigned()
    table.foreign('userIndex').references('users.tableIndex')
    table.string('label', 36).defaultTo('API Key')
    table.string('APIKey', 32)
  })
  const keys = await knex.select('tableIndex', 'APIKey').from('users')
  await Promise.all(keys.map(async key => {
    await knex('APIKeys').insert({
      userIndex: key.tableIndex,
      label: 'Migrated from legacy user',
      APIKey: key.APIKey
    })
  }))
  await knex.schema.table('users', table => {
    table.dropColumn('APIKey')
  })
  await knex.schema.createTable('platforms', table => {
    table.increments('tableIndex').primary().unsigned()
    table.timestamp('created').defaultTo(knex.fn.now())
    table.string('platformID', 16)
    table.string('name', 36)
    table.string('description', 160)
    table.integer('ownerUserIndex').unsigned()
    table.foreign('ownerUserIndex').references('users.tableIndex')
    table.integer('totalSales', 15).defaultTo(0)
    table.integer('allowXPUB', 1).defaultTo(0)
  })
  await knex.schema.createTable('commissions', table => {
    table.increments('tableIndex').primary().unsigned()
    table.timestamp('created').defaultTo(knex.fn.now())
    table.integer('platformIndex').unsigned()
    table.foreign('platformIndex').references('platforms.tableIndex')
    table.string('commissionID', 16)
    table.string('label', 36)
    table.string('commissionAddress', 60)
    table.string('commissionXPUB', 115)
    table.integer('XPUBIndex').defaultTo(0)
    table.string('commissionMethod', 10).defaultTo('address')
    table.string('commissionPercentage', 6).defaultTo('0.00')
    table.string('commissionAmount', 8).defaultTo('0.00')
    table.string('commissionCurrency', 3).defaultTo('BCH')
    table.string('commissionLessMore', 4).defaultTo('less')
    table.integer('minimumTransactionAmount', 8).defaultTo(-1)
    table.integer('maximumTransactionAmount', 8).defaultTo(-1)
    table.integer('minimumCommissionAmount', 8).defaultTo(-1)
    table.integer('maximumCommissionAmount', 8).defaultTo(-1)

  })
  await knex.schema.createTable('platformAdministrators', table => {
    table.increments('tableIndex').primary().unsigned()
    table.timestamp('created').defaultTo(knex.fn.now())
    table.integer('active', 1).defaultTo(1)
    table.timestamp('revocationDate').nullable()
    table.string('revocationReason', 160)
    table.integer('userIndex').unsigned()
    table.foreign('userIndex').references('users.tableIndex')
    table.integer('platformIndex').unsigned()
    table.foreign('platformIndex').references('platforms.tableIndex')
  })
}

exports.down = async knex => {
  await knex.schema.table('users', table => {
    table.dropColumns(
      'platformIndex',
      'contributionTotal',
      'contributionLessMore',
      'contributionCurrency',
      'contributionAmount',
      'contributionPercentage',
      'nativeCurrency',
      'payoutMethod',
      'payoutXPUB',
      'XPUBIndex'
    )
    table.renameColumn('passwordHash', 'password')
    table.renameColumn('passwordSalt', 'salt')
    table.string('APIKey', 32)
  })
  await knex.schema.table('payments', table => {
    table.renameColumn('privateKey', 'paymentKey')
    table.dropColumns(
      'callbackStatus',
      'invoiceAmount',
      'status',
      'platformID',
      'processingAttempts',
    )
    table.string('paymentTXID', 64)
    table.string('transferTXID', 64)
  })
  await knex.schema.raw(
    'ALTER TABLE payments CHANGE tableIndex paymentIndex int unsigned AUTO_INCREMENT'
  )
  await knex.schema.raw(
    'ALTER TABLE payments MODIFY COLUMN callbackURL varchar(128)'
  )
  await knex.schema.raw(
    'ALTER TABLE payments MODIFY COLUMN paymentID varchar(32)'
  )
  const keys = await knex.select('userIndex', 'APIKey').from('APIKeys')
  await Promise.all(keys.map(async key => {
    await knex('users')
      .where('tableIndex', '=', key.userIndex)
      .update({
        APIKey: key.APIKey
      })
  }))
  await knex.schema.dropTable('APIKeys')
  await knex.schema.raw(
    'ALTER TABLE users CHANGE tableIndex userID int unsigned AUTO_INCREMENT'
  )
  await knex.schema.dropTable('platformAdministrators')
  await knex.schema.dropTable('commissions')
  await knex.schema.dropTable('platforms')
}