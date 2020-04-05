
exports.seed = async knex => {

  await knex.schema.raw(
    'SET @@foreign_key_checks = 0'
  )

  // users
  await knex('users').del()
  await knex('users').insert([
    {
      tableIndex: 1,
      username: 'gwtestuser1',
      payoutAddress: 'bitcoincash:pz3txlyql9vc08px98v69a7700g6aecj5gc0q3xhng',
      merchantID: 'deadbeef20191111',
      passwordHash: '4aba048f2605a9e41baa0509ad280ccfdbb8a6ff9fdb317eab36e92e35384de1',
      passwordSalt: 'b6faa3ea7b1882a3eb6bc22a5f96f557cc280d14a8fb168e22d28a0a4015b8e5'
    },
    {
      tableIndex: 2,
      username: 'gwtestuser2',
      payoutAddress: 'bitcoincash:pz3txlyql9vc08px98v69a7700g6aecj5gc0q3xhng',
      merchantID: 'deadbeef20192222',
      passwordHash: '4aba048f2605a9e41baa0509ad280ccfdbb8a6ff9fdb317eab36e92e35384de1',
      passwordSalt: 'b6faa3ea7b1882a3eb6bc22a5f96f557cc280d14a8fb168e22d28a0a4015b8e5'
    },
    {
      tableIndex: 3,
      username: 'gwtestuser3',
      payoutMethod: 'XPUB',
      payoutXPUB: 'xpub661MyMwAqRbcF9Z9FLyFogJWptKTF9JJCLf3axd43h6FQRCH2NU6b42YoFSNrQieJqV5HywBGjAtr393tBhu3yfUK6dtEhY2UV5dgbLoYhU',
      merchantID: 'deadbeef20193333',
      passwordHash: '4aba048f2605a9e41baa0509ad280ccfdbb8a6ff9fdb317eab36e92e35384de1',
      passwordSalt: 'b6faa3ea7b1882a3eb6bc22a5f96f557cc280d14a8fb168e22d28a0a4015b8e5'
    }
  ])

  // exchangeRates
  await knex('exchangeRates').del()
  await knex('exchangeRates').insert([
    {
      pair: 'BCH-USD',
      rate: '115.00'
    },
    {
      pair: 'BCH-EUR',
      rate: '100.00'
    },
    {
      pair: 'BCH-CNY',
      rate: '780.00'
    },
    {
      pair: 'BCH-JPY',
      rate: '12600'
    }
  ])

  // APIKeys
  await knex('APIKeys').del()
  await knex('APIKeys').insert([
    {
      userIndex: 1,
      APIKey: 'user1key1',
      label: 'User 1 test key 1'
    },
    {
      userIndex: 1,
      APIKey: 'user1key2',
      label: 'User 1 test key 2'
    },
    {
      userIndex: 1,
      APIKey: 'user1key3',
      label: 'User 1 test key 3',
      active: 0
    },
    {
      userIndex: 3,
      APIKey: 'user3key1',
      label: 'User 3 test key 1'
    },
    {
      userIndex: 3,
      APIKey: 'user3key2',
      label: 'User 3 test key 2'
    },
    {
      userIndex: 3,
      APIKey: 'user3key3',
      label: 'User 3 test key 3',
      active: 0
    }
  ])

  // platforms
  await knex('platforms').del()
  await knex('platforms').insert([
    {
      platformID: 'deadbeef20191121',
      name: 'gwtestplatform1',
      description: 'test platform 1',
      ownerUserIndex: 1
    },
    {
      platformID: 'deadbeef20191122',
      name: 'gwtestplatform2',
      description: 'test platform 2',
      ownerUserIndex: 3
    }
  ])

  // platformAdministrators
  await knex('platformAdministrators').del()
  await knex('platformAdministrators').insert([
    {
      userIndex: 2,
      platformIndex: 1
    },
    {
      userIndex: 3,
      platformIndex: 1,
      active: 0,
      revocationReason: 'You stole fizzy lifting drinks'
    }
  ])

  await knex('commissions').del()
  await knex('commissions').insert([
    {
      platformIndex: 1,
      commissionID: 'deadbeef20191131',
      label: 'commission',
      commissionAddress: 'bitcoincash:pz3txlyql9vc08px98v69a7700g6aecj5gc0q3xhng',
      commissionPercentage: '1.00',
      commissionLessMore: 'more'
    },
    {
      platformIndex: 2,
      commissionID: 'deadbeef20191132',
      label: 'commission',
      commissionXPUB: 'xpub661MyMwAqRbcF9Z9FLyFogJWptKTF9JJCLf3axd43h6FQRCH2NU6b42YoFSNrQieJqV5HywBGjAtr393tBhu3yfUK6dtEhY2UV5dgbLoYhU',
      commissionMethod: 'XPUB',
      commissionAmount: '0.01',
      commissionLessMore: 'more'
    }
  ])

  await knex.schema.raw(
    'SET @@foreign_key_checks = 1'
  )
}