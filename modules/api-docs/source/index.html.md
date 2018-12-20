---
title: API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - javascript

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

## Overview

> All code for these demonstrations is written in JavaScript (specifically)
> ES2017. If you haven't heard of it, you should definately check it out. It's
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

# POST Endpoints

POST endpoints generally create or update information, as opposed to GET which
is primarily for retrieving information from the server.

## POST /register

> Create a new merchant account:

```js
let result = await axios.post(
  'https://api.gateway.cash/register',
  {
    'address': 'BITCOIN_CASH_ADDRESS',
    'username': 'JohnGalt12',
    'password': 'IHeartDagney'
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
The API server does not validate that passwords are secure or have
entropy. It is the responsibility of the end user and/or the front-end
service provider to ensure that a secure password is provided. Passwords
are always salted and hashed prior to being stored in the database.
</aside>

<aside class="notice">
Your username must be between 5 and 24 characters, must be unique, must not
contain spaces/tabs or other odd characters, and is an optional parameter at
registration time. Usernames can always be set later with the `POST /username`
endpoint. Usernames are converted to lower case before being stored in the
database.
</aside>

## POST /pay

> Create a new invoice and generate a payment address:

```js
let result = await axios.post(
  'https://api.gateway.cash/pay',
  {
    'merchantID': 'MERCHANT_ID',
    'paymentID': 'PAYMENT_ID',
    'callbackURL': 'CALLBACK_URL'
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
BE AWARE: Merchants who leverage callback URLs must be careful and make sure to
validate that payments they receive are legitimate. <b>CALLBACK URLS ARE PUBLIC!!!</b> When you receive a callback from Gateway, it will ALWAYS contain a property called `"transferTXID"` which is a Bitcoin Cash transaction moving funds to the merchant's address. <b>Merchants MUST verify that this transaction
is valid and that an acceptable amount has been paid.</b>
</aside>

## POST /paid

> Send the request with the payment address and TXID:

```js
let result = await axios.post(
  'https://api.gateway.cash/paid',
  {
    'paymentAddress': 'PAYMENT_ADDRESS',
    'paymentTXID': 'PAYMENT_TXID'
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
If an invoice is paid without calling the `POST /paid` endpoint, the payment
will still eventually be forwarded to the merchant via the Gateway broken
payments service within 24 hours. However, applications should always send a
`POST /paid` request whenever possible so the merchant can receive the payment
instantaneously.
</aside>

## POST /address

> Change the payout address:

```js
let result = await axios.post(
  'https://api.gateway.cash/address',
  {
    'APIKey': 'YOUR_API_KEY',
    'newAddress': 'BITCOIN_CASH_ADDRESS'
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
    'APIKey': 'YOUR_API_KEY',
    'newAddress': 'JohnGalt12'
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
YES | `APIKey` | The API key of the merchant who's payout address is to be updated
YES | `username` | The new username for the merchant account

<aside class="notice">
Your username must be between 5 and 24 characters, must be unique, must not
contain spaces/tabs or other odd characters will be converted to lower case
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
      'address': 'BITCOIN_CASH_ADDRESS',
      'password': 'IHeartDagney'
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
      'username': 'JohnGalt12',
      'password': 'IHeartDagney'
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

> Use the API key you receive when calling other API endpoints .

The `GET /login` endpoint simply retrieves the API key for your account. You
may then use the key to access other portions of the API.

### Parameters

One of `address` or `username` is required along with a `password`.

Name | Description
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

## GET /address

## GET /merchantid

## GET /username

## GET /totalsales

## GET /newapikey

# Callback URLs

callbacks are a thing.
