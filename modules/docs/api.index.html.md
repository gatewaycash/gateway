---
title: API Reference

toc_footers:
  - <span>Copyright &copy 2018 Gateway</span>
  - <a href='https://github.com/lord/slate'>Documentation Powered by Slate</a>

search: true
---

# Introduction

> Hello there! This panel provides useful descriptions, annotations and
> examples demonstrating the features of the API. It generally shows up on the
> right-hand side of your screen and will stay lined up so that the examples
> always reference what's being talked about to the left. If you don't
> understand something, glance over and you'll find some handy examples.

Welcome to the Gateway.cash API! You can use our API to create and manage
merchant accounts, make and receive Bitcoin Cash payments, keep track of invoices and more!

<aside class="notice">
This documentation is for the Gateway.cash back-end server API. If you are only
trying to use the Gateway payment button, you may be looking for the
<a href="https://gateway.cash/docs">Gateway Payment Button Documentation</a>.
</aside>

## Overview

> All code for these demonstrations is written in JavaScript (specifically)
> ES2017. If you haven't heard of it, you should definitely check it out. It's
> pretty darn cool!

The API is served over HTTP or HTTPS with your current URL as a basepoint.
If you are running a local instance of the server at `http://127.0.0.1:8080/`
then your requests will start with that URL.

For example, the endpoint for `/login` would be `http://127.0.0.1:8080/login`
on your local instance. The examples in this documentation assume you are
using a basepoint URL of `https://api.gateway.cash/` which is the production
server Gateway uses across all of our services.

You are free to use our API server as you wish. If we receive excessive
spam we may choose to block your access. Like all open-source projects, you
are also free to run your own server on the internet if you wish.

## API Requests

> All examples on this page use a popular JavaScript library called axios for
> making HTTP and HTTPS requests. Before you use axios, be sure to include it
> in your JavaScript file like so:

```js
const axios = require('axios')
```

Making a request to the API will result in a JSON object string being
returned. The `"status"` property of the object will either be `"success"` or
`"error"` for all requests.

When `"status"` is `"error"`, the JSON object will always contain an `"error"` property which will consist of a brief error message. `"description"` will contain a more in-depth explanation of the problem, suitable for showing to your users.

When `"status"` is `"success"`, the object will contain the information
documented here.

## API Keys

> For illustration purposes, we'll be using placeholders like YOUR_API_KEY
> and BITCOIN_CASH_ADDRESS throughout these examples. Be sure to replace
> and substitute those values for your actual data before trying to use the API.

An API key is required in all but a few special cases when working with the
API. You don't need a key to create or pay invoices, but to be able to manage
merchant accounts, you will need to generate an API key.

Merchant accounts can be generated using the `POST /register` endpoint. The API
key for your account can be retrieved with `GET /login`, and a new key can be
generated with `GET /newapikey`.

# Payment Processing

All payments received by the Gateway service are forwarded to the merchant's
payout address as soon as we receive them. Generally, this will happen within 60
seconds of the payment being sent.

<aside class="notice">
The Gateway payment processing daemon now runs every 30 seconds! This means a
faster merchant and customer experience as well as lower latency for Gateway
payments.
</aside>

## Broken Payments

When a customer pays an invoice but neglects to call the `POST /paid` endpoint
and mark it as paid, the payment will still eventually arrive at the merchant's
address.

The Gateway Broken Payments Service runs every 12 hours and checks the balances
of all addresses over which Gateway has custody. Any invoices who's payment
addresses have a balance are immediately moved to the pending payments queue
at which point the payment is processed as normal.

<aside class="notice">
You may notice payments with TXIDs such as "broken-payment-txid-unknown-xxxxx".
These payments were made to invoice addresses without the customer's browser
calling the POST /paid endpoint after paying.
</aside>

## Extended Public Keys (XPUB)

There are plans to support the use of merchant extended public keys for invoice
address derivation in the future. When this is implemented, payments are never
held in the custody of Gateway and Gateway only provides invoice tracking for
these orders.

# POST Endpoints

POST endpoints generally create or update information, as opposed to GET which
is primarily for retrieving information from the server.

## POST /register

> Create a new merchant account:

```js
let result = await axios.post(
  'https://api.gateway.cash/register',
  {
    address: 'BITCOIN_CASH_ADDRESS',
    username: 'JohnGalt12',
    password: 'IHeartDagney'
  }
)
```

> When you successfully register a new merchant account, you'll get something
> like this back:

```json
{
  "status": "success",
  "APIKey": "NEW_API_KEY"
}
```

> So, to print your new API key:

```js
console.log(result.data.APIKey)
```

Before you can use most portions of the Gateway API, you must first register
for a merchant account. Without an API key, you can still create invoices and
mark them as paid. A merchant account allows you to create payment buttons,
view payments for each button, track your total sales and much more.

### Parameters

Required | Name | Description
---------|------|------------
YES | `address` | The Bitcoin Cash address to use for your merchant account
NO | `username` | You may also provide a username for more convenient login
YES | `password` | A unique and strong password to protect your new account

<aside class="notice">
Please provide your Bitcoin Cash address in CashAddress format. If it is given
in any other format, it will be translated prior to being stored in the
database. If we can't understand your address, we can't pay you!
</aside>

<aside class="notice">
The API server does not evaluate the security or entropy of provided passwords.
It is the responsibility of the end user and/or the front-end
service provider to ensure that a secure password is provided. Passwords
are always salted and hashed prior to being stored in the database.
</aside>

<aside class="notice">
Your username must be between 5 and 24 characters, must be unique, must not
contain spaces/tabs or other odd characters, and is an optional parameter at
registration time. Usernames can always be set later with the POST /username
endpoint. Usernames are converted to lower case before being stored in the
database.
</aside>

## POST /pay

> Create a new invoice and generate a payment address:

```js
let result = await axios.post(
  'https://api.gateway.cash/pay',
  {
    merchantID: 'MERCHANT_ID',
    paymentID: 'PAYMENT_ID',
    callbackURL: 'CALLBACK_URL'
  }
)
```

> If successful, you should get back something like this:

```json
{
  "status": "success",
  "paymentAddress": "BITCOIN_CASH_ADDRESS"
}
```

> So, to print your payment address:

```js
console.log(result.data.paymentAddress)
```

The /pay endpoint generates a new invoice for the user and provides them with an
address to pay the merchant.

### Parameters

Required | Name | Description
---------|------|------------
YES | `merchantID` | The ID for the merchant for whom the payment is intended
NO | `paymentID` | An identifier for the payment which will be shown to the merchant
NO | `callbackURL` | A callback URL that can be used by the merchant for payment notifications

<aside class="success">
Nope! You don't need an API key when using this endpoint.
</aside>

<aside class="warning">
Merchants who leverage callback URLs must be careful and make sure to
validate that payments they receive are legitimate. <b>CALLBACK URLS ARE PUBLIC!!!</b> When you receive a callback from Gateway, it will ALWAYS contain a property called "transferTXID" which is a Bitcoin Cash transaction moving funds to the merchant's address. <b>Merchants MUST verify that this transaction
is valid and that an acceptable amount has been paid.</b>
</aside>

## POST /paid

> Send the request with the payment address and TXID:

```js
let result = await axios.post(
  'https://api.gateway.cash/paid',
  {
    paymentAddress: 'PAYMENT_ADDRESS',
    paymentTXID: 'PAYMENT_TXID'
  }
)
```

> If successful, you should get back something like this:

```json
{
  "status": "success"
}
```

Once an invoice has been paid, use the `POST /paid` endpoint to give the
payment TXID to the server for processing.

### Parameters

Required | Name | Description
---------|------|------------
YES | `paymentAddress` | The payment address of the invoice
YES | `paymentTXID` | The TXID of the transaction which pays the invoice

<aside class="success">
Nope! You don't need an API key when using this endpoint.
</aside>

<aside class="notice">
If an invoice is paid without calling the POST /paid endpoint, the payment
will still eventually be forwarded to the merchant via the Gateway broken
payments service within 24 hours. However, applications should always send a
POST /paid request whenever possible so the merchant can receive the payment
instantaneously.
</aside>

## POST /address

> Change the payout address:

```js
let result = await axios.post(
  'https://api.gateway.cash/address',
  {
    APIKey: 'YOUR_API_KEY',
    newAddress: 'BITCOIN_CASH_ADDRESS'
  }
)
```

> Your new address will be sent back for confirmation. If you send an address in
> a format other than CashAddress, the CashAddress formatted version will always
> be returned.

```json
{
  "status": "success",
  "newAddress": "BITCOIN_CASH_ADDRESS"
}
```

Allows a merchant to specify a new payout address for their account.

### Parameters

Required | Name | Description
---------|------|------------
YES | `APIKey` | The API key of the merchant who's payout address is to be updated
YES | `newAddress` | The new payout address for the merchant

<aside class="notice">
Please provide your Bitcoin Cash address in CashAddress format. If it is given
in any other format, it will be translated prior to being stored in the
database. If we can't understand your address, we can't pay you!
</aside>

## POST /username

> Change the account username:

```js
let result = await axios.post(
  'https://api.gateway.cash/username',
  {
    APIKey: 'YOUR_API_KEY',
    newAddress: 'JohnGalt12'
  }
)
```

> Your new username will be sent back for confirmation. Usernames are converted
> to lower case before being stored in the database.

```json
{
  "status": "success",
  "username": "johngalt12"
}
```

Allows a merchant to specify a new username for their account.

### Parameters

Required | Name | Description
---------|------|------------
YES | `APIKey` | The API key of the merchant who's username is to be updated
YES | `username` | The new username for the merchant account

<aside class="notice">
Your username must be between 5 and 24 characters, must be unique, must not
contain spaces/tabs or other odd characters and will be converted to lower case
before being stored in the database.
</aside>

# GET Endpoints

GET endpoints are generally for retrieving information from the server rather
than updating or changing it.

## GET /login

> You may either log into Gateway using your payout address or your username.
> Logging in by address:

```js
let result = await axios.get(
  'https://api.gateway.cash/login',
  {
    params: {
      address: 'BITCOIN_CASH_ADDRESS',
      password: 'IHeartDagney'
    }
  }
)
```

> Logging in by username:

```js
let result = await axios.get(
  'https://api.gateway.cash/login',
  {
    params: {
      username: 'JohnGalt12',
      password: 'IHeartDagney'
    }
  }
)
```

> Whichever method you choose, a successful response will look like this:

```json
{
  "status": "success",
  "APIKey": "YOUR_API_KEY"
}
```

> Use the API key you receive when calling other endpoints.

The `GET /login` endpoint simply retrieves the API key for your account. You
may then use the key to access other portions of the API.

### Parameters

One of `address` or `username` is required along with a `password`.

Name | Description
-----|------------
`address` | The merchant account payout address
`username` | The username for the merchant account
`password` | The merchant account password

<aside class="notice">
The API key for any account will generally remain the same unless GET
/newapikey is called. If you store the key somewhere, just be aware that it can
be used to access and change merchant account settings, including the payout
address. If you're building something like a mobile app where login information
is generally saved, you should store the API key rather than the username and
password. You should always encrypt credentials when plausible.
</aside>

## GET /payments

> Get a list of invoices for your account:

```js
let result = await axios.get(
  'https://api.gateway.cash/payments',
  {
    params: {
      APIKey: 'YOUR_API_KEY',
      includeKeys: 'NO',
      includeUnpaid: 'NO'
    }
  }
)
```

> The response will look something like this:

```json
{
  "status": "success",
  "numberOfPayments": 4,
  "payments": [
    {
      "paymentAddress":"bitcoincash:qqet0p878uc7e8trwvxqefgmqtkkvqzsvs4vrk4h9s",
      "paidAmount":9003,
      "paymentTXID":"ec396d7a28997df889a0c7dfda6d01740ba9e151ac4df182076185d844a687bc",
      "transferTXID":"8a17fc8f308cbc45e030e41cd0a8a393d9afd3aaf44d86093126f09cbce826fc",
      "paymentID": "order-fe43dcb493ac",
      "created": "2018-10-22T23:49:53.000Z",
      "paymentKey": "hidden"
    },
    {
      "paymentAddress":"bitcoincash:qqucfprkhtwknhhdvthj0jazk5f6erxmxqgjp4ht5q",
      "paidAmount":10000,
      "paymentTXID":"afee8509dc5139e28ae8e0ee0b1ea3b6e45aa62bce973a3f942281501cb9b526",
      "transferTXID":"bc0985d2b7b9ec955318a56cde3481d8beecd87bd325f0c78ee5f79ced96907e",
      "paymentID":"donation",
      "created":"2018-10-22T02:10:38.000Z",
      "paymentKey":"hidden"
    },
    {
      "paymentAddress":"bitcoincash:qzm62utwlfccx55qvm0lxjk4cq0x4ag3tsmc8h22jt",
      "paidAmount":9011,
      "paymentTXID":"526e318e120fc3d43faf2a502c6de88748457418051090b680ede4760b639f51",
      "transferTXID":"7974696486a82be8eebd14f3592f902a8f0ee3b50f6f15abace91faf7e548fa7",
      "paymentID":"null",
      "created":"2018-10-21T23:32:33.000Z",
      "paymentKey":"hidden"
    },
    {
      "paymentAddress":"bitcoincash:qphqgzujdyp7034q6p472wdyyxsy5k83hur9d425c9",
      "paidAmount":100000,
      "paymentTXID":"0544124297f8ebd0cf8652f3855bc94da57afa0fcbba99da84c07a015aedfc39",
      "transferTXID":"653ae98d262fde67a7fbef7ad103fd790d61f693ab617b71fe45400b64ed1e0f",
      "paymentID":"donation-0.001",
      "created":"2018-10-20T13:30:35.000Z",
      "paymentKey":"hidden"
    }
  ]
}
```

This endpoint allows merchants to get a list of their payment invoices.

### Parameters

Required | Name | Default | Description
---------|------|---------|------------
YES | `APIKey` | `N/A` | The merchant account API key
NO | `includeKeys` | `NO` | Include payment address private keys in the response
NO | `includeUnpaid` | `NO` | Include broken, unpaid or half-complete invoices

<aside class="notice">
Private keys are never included by default. You may always request that private
keys for payment addresses be included by using the "includeKeys" parameter and
giving a value of uppercase "YES". This may be useful if you'd like to process
your own payments or for debugging.
</aside>

<aside class="notice">
You may set the "includeUnpaid" parameter to uppercase "YES" to include invoices
that are broken, unpaid, half-processed or otherwise deformed. This is useful
for hunting down stuck payments (which can be recovered with "includeKeys"), and
for debugging your payment invoices.
</aside>

## GET /address

> Get the payout address for the merchant account:

```js
let result = await axios.get(
  'https://api.gateway.cash/address',
  {
    params: {
      APIKey: 'YOUR_API_KEY'
    }
  }
)
```

> A successful response will look like this:

```json
{
  "status": "success",
  "payoutAddress": "BITCOIN_CASH_ADDRESS"
}
```

This endpoint returns the current merchant account payout address.

### Parameters

Required | Name | Description
---------|------|------------
YES | `APIKey` | The merchant account API key

## GET /merchantid

> Get the merchant ID for the account:

```js
let result = await axios.get(
  'https://api.gateway.cash/merchantid',
  {
    params: {
      APIKey: 'YOUR_API_KEY'
    }
  }
)
```

> A successful response will look like this:

```json
{
  "status": "success",
  "merchantID": "MERCHANT_ID"
}
```

This endpoint returns the merchant ID.

### Parameters

Required | Name | Description
---------|------|------------
YES | `APIKey` | The merchant account API key

## GET /username

> Get the current username for the merchant account:

```js
let result = await axios.get(
  'https://api.gateway.cash/username',
  {
    params: {
      APIKey: 'YOUR_API_KEY'
    }
  }
)
```

> A successful response will look like this:

```json
{
  "status": "success",
  "username": "johngalt12"
}
```

This endpoint returns the current merchant account username.

### Parameters

Required | Name | Description
---------|------|------------
YES | `APIKey` | The merchant account API key

## GET /totalsales

> Get total sales information for the merchant account:

```js
let result = await axios.get(
  'https://api.gateway.cash/totalsales',
  {
    params: {
      APIKey: 'YOUR_API_KEY'
    }
  }
)
```

> A successful response will look like this:

```json
{
  "status": "success",
  "totalsales": 133706969
}
```

This endpoint returns the total sales for the merchant account.

### Parameters

Required | Name | Description
---------|------|------------
YES | `APIKey` | The merchant account API key

<aside class="notice">
Total sales are returned in units of satoshi.
</aside>

## GET /newapikey

> Generate a new API key for the merchant account:

```js
let result = await axios.get(
  'https://api.gateway.cash/newapikey',
  {
    params: {
      APIKey: 'YOUR_API_KEY'
    }
  }
)
```

> A successful response will look like this:

```json
{
  "status": "success",
  "newAPIKey": "NEW_API_KEY"
}
```

This endpoint will generate a new API key for your account, invalidating the
old API key.

### Parameters

Required | Name | Description
---------|------|------------
YES | `APIKey` | The old merchant account API key

<aside class="notice">
When you change your API key, your old key immediately becomes invalid. You must
use your new API key for subsequent requests.
</aside>

# Callback URLs

Merchants can leverage callback URLs to get notified when a payment reaches
their payout address. While callback URLs can be handy, there are a few things
you need to keep in mind when building your applications.

## Don't Trust. Verify.

> Callbacks will be sent as POST requests to the URL provided by the customer
> when they requested the invoice. The data contained in a legitimate callback
> will look like this:

```json
{
  "transferTXID": "VALIDATE_THE_TRANSFER_TXID_BEFORE_SHIPPING_ORDERS",
  "paymentAddress": "GATEWAY_INVOICE_PAYMENT_ADDRESS",
  "paymentTXID": "CUSTOMER_PAYMENT_TXID"
}
```

When you create a payment button and publish it on the internet (on your
website, a check-out page, a mobile app or a point-of-sale system), your
callback URL becomes public. This means that any malicious customer can see
your callback URL and make illegitimate callbacks.

To solve this rather large problem, Gateway will always and only send a
callback containing the Transaction Identifier (TXID) of a transaction which
transfers funds directly to your merchant account payout address.

This TXID will always be in a field called `"transferTXID"`. However, since
callback URLs are public, it is not enough simply to verify the field exists.
Merchants MUST, I repeat, <b>MUST VERIFY that the `transferTXID` field points at a Bitcoin Cash transaction transferring AN ACCEPTABLE payment amount to AN ADDRESS CONTROLLED BY THE MERCHANT.</b>

Failure to perform this validation <b>will lead to hackers defrauding you</b>.

## Parameters

In addition to the above, callbacks contain several pieces of information.

Required | Name | Description
---------|------|------------
YES | `transferTXID` | A TXID moving an appropriate amount of funds to a merchant address (MUST BE VALIDATED BY MERCHANT!!!)
NO | `paymentAddress` | The Gateway payment address used by the customer to pay the invoice
NO | `paymentTXID` | The TXID of a transaction moving funds from the customer's address to the Gateway invoice address

<aside class="warning">
The "paymentTXID" was provided by the customer and so may not be valid. It is
provided for record keeping and the customer's convenience only.
</aside>

<aside class="notice">
The amount of information contained in callbacks is intentionally kept sparse.
In particular, the amount being paid is never sent so that the merchant
validates this information by querying the transferTXID from the network.
</aside>
