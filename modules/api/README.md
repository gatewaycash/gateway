# Gateway API and Backend Server

A sever for managing merchants and payments

## Initial Setup

To set up the API for the first time:

```
yarn api-setup
```

You will need a local MySQL server for development. Create a new database and a
user with read/write privileges for the database. Enter the information when
prompted.

## Test Database Credentials

All passwords are `GatewayTest1`. All addresses are the Gateway donation
address. All XPUB values are
`xpub661MyMwAqRbcF9Z9FLyFogJWptKTF9JJCLf3axd43h6FQRCH2NU6b42YoFSNrQieJqV5HywBGjA
tr393tBhu3yfUK6dtEhY2UV5dgbLoYhU`. There are three useers total Users 1 and 3
each with 3 API keys (one revoked), two platforms and a few
completed transactions are completed. Test usernames are `gwtestuser1`,
`gwtestuser2` and `gwtestuser3` respectively.

Platform names are `gwtestplatform1` and `gwtestplatform2`. `gwtestuser1` owns
`gwtestplatform1` with `gwtestuser2` being an administrator and `gwtestuser3`
being a revoked administrator.

`gwtestplatform2` is owned by `gwtestuser3`. `gwtestplatform2` and `gwtestuser3`
both use `payoutXPUB`, all others use `payoutAddress`.
