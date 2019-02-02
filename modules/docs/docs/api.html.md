---
title: Gateway API

toc_footers:
  - <span>Copyright &copy 2018 Gateway</span>
  - <a href='https://github.com/lord/slate'>Documentation Powered by Slate</a>

search: true
---

# Gateway.cash API

> Hello there! This panel provides useful descriptions, annotations and
> examples demonstrating the features of the API. It generally shows up on the
> right-hand side of your screen and will stay lined up so that the examples
> always reference what's being talked about to the left. If you don't
> understand something, glance over and you'll find some handy examples.

Welcome to the Gateway.cash API! You can use our API to create and manage
merchant accounts, make and receive Bitcoin Cash payments, keep track of
invoices and more!

<aside class="notice">
This documentation is for the Gateway.cash back-end server API. If you want to
use the Gateway.cash PayButton on your site, head over to
<a href="https://gateway.cash">gateway.cash</a> and set up an account. If
you're looking for ways you can customize the behavior of PayButton, check out
the <a href="https://gateway.cash/docs">PayButton Docs</a>.
</aside>

## Overview

> All code for these demonstrations is written in JavaScript (specifically
> ES2017). If you haven't heard of it, you should definitely check it out. It's
> pretty darn cool!

The API is served over HTTP or HTTPS with your current URL as a basepoint.
If you are running a local instance of the server at `http://127.0.0.1:8080/`
then your requests will start with that URL.

### URL Prefixes

API endpoints are prefixed with a version number, in the format
`BASEPOINT/vX/endpoint`. `X` represents the API version. New API versions are
released when a "breaking change" is made which would cause old clients to stop
working. The current version of the API is `v2`.

For example, the endpoint for `/user/login` is
`http://127.0.0.1:8080/v2/user/login` on your local instance. The examples in
this documentation assume you are using a basepoint URL of
`https://api.gateway.cash/` which is the production server Gateway uses across
all of our services.

### A Note on the Use of Our Servers

You are free to use our API server as you wish. If we receive excessive
spam we may choose to block your access. Like all open-source projects, you
are also free to run your own server on the internet if you wish.

It is a common misconception that because gateway.cash is able to block, ban or
"censor" merchants who do bad things from our platform, that the Gateway
project is somehow centralized. If you disagree with our decision, you may run
your own servers since our code is open-source. Merchants can take advantage of
all of the features of Gateway regardless of our policies.

## API Requests

> All examples on this page use a popular JavaScript library called axios for
> making HTTP and HTTPS requests. Before you use axios, be sure to include it
> in your JavaScript file like so:

```js
import axios from 'axios'
```

Making a request to the API will result in a JSON object string being
returned. The `"status"` property of the object will either be `"success"` or
`"error"` for all requests.

When `"status"` is `"error"`, the JSON object will always contain an `"error"`
property which will consist of a brief error message. `"description"` will
contain a more in-depth explanation of the problem, suitable for showing to
your users.

When `"status"` is `"success"`, the object will contain the information
documented here.

## API Keys

> For illustration purposes, we'll be using placeholders like YOUR_API_KEY
> and BITCOIN_CASH_ADDRESS throughout these examples. Be sure to replace
> and substitute those values for your actual data before trying to use the API.

An API key is required in all but a few special cases when working with the
Gateway API. You don't need a key to create or pay invoices, but to be able to
manage merchant accounts, administrate platforms or view invoices you will need
to generate an API key.

Merchant accounts can be generated using the `/user/register` endpoint.
When you create an account, your first API key is generated automatically. Keys
can be managed with the `/api/keys` and `/api/key` endpoints, and `/user/login`
will retrieve a working API key for your account.

<aside class="success">
<b>ProTip:</b> If you've already made a merchant account on gateway.cash, you
can retrieve an API key with /user/login.
</aside>

# Accounts, Access and Keys

This section covers accessing and managing your user account, API keys and
related topics.

## Registration

> Create a new basic merchant account:

```js
let result = await axios.post(
  'https://api.gateway.cash/v2/user/register',
  {
    address: 'BITCOIN_CASH_ADDRESS',
    username: 'JohnGalt12',
    password: 'IHeartDagney'
  }
)
```

> Create a new Gateway Platforms user (see Platforms section):

```js
let result = await axios.post(
  'https://api.gateway.cash/v2/user/register',
  {
    address: 'BITCOIN_CASH_ADDRESS',
    username: 'JohnGalt12',
    password: 'IHeartDagney',
    platformID: 'YOUR_PLATFORM_ID'
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
Sometimes | `address` | The Bitcoin Cash address to use for your merchant account. Required when `XPUB` is not provided
Sometimes | `XPUB` | The extended public key (XPUB) for your merchant account. Required when `address` is not provided
Yes | `username` | The username for your merchant account
Yes | `password` | A unique and strong password to protect your new account
No | `platformID` | Makes this user a Gateway Platforms user. See the Platforms section below for more info

### A Warning About XPUB with Platforms Users

It is not possible to utilize Platform commissions if your Platforms user
accounts have XPUB keys. This is because when XPUB is used, payment is
forwarded directly to the merchant and Gateway never controls the funds.

To avoid this problem, always send Platforms user registration requests with an
address only and not an XPUB key. If you are sending Platforms user
registration requests from the user's browser, be aware of the possibility for
malicious activity. A user can avoid paying any commissions if they are using
XPUB.

<b>Strongly consider</b> sending the Platforms user registration requests from
your server instead. Randomly generate usernames and passwords which are stored
with your users' login information.

If you do not ever want to take a commission and only want to use Gateway
Platforms to track total platform sales, you can still use XPUB with Platforms
user accounts. Include `dismissXPUBWithPlatformIDWarning=YES` with your
request to bypass the warning. You can also disallow XPUB entirely (see below).

<aside class="notice">
Please provide your Bitcoin Cash address in CashAddress format. If it is given
in any other format, it will be translated prior to being stored in the
database. If we can't understand your address, we can't pay you!
</aside>

<aside class="notice">
The API server does not thoroughly evaluate the security or entropy of provided passwords.
It is the responsibility of the end user and/or the front-end
service provider to ensure that a secure password is provided. Passwords
are always salted and hashed prior to being stored in the database.
</aside>

<aside class="notice">
Your username must be between 5 and 24 characters, must be unique and must not
contain spaces/tabs or other odd characters. Usernames are not case sensitive.
</aside>

## Logging In

> In previous versions of this API, it was possible to log in with your payout
> address. Since it's now possible for multiple people to have the same payout
> address, you must always use your username and password when logging in:

```js
let result = await axios.get(
  'https://api.gateway.cash/v2/user/login',
  {
    params: {
      username: 'JohnGalt12',
      password: 'IHeartDagney'
    }
  }
)
```

> A successful response will always return a working API key for your account:

```json
{
  "status": "success",
  "APIKey": "YOUR_API_KEY"
}
```

> Use the API key you receive when calling other endpoints.

When you need to retrieve a working API key for your account, send a GET request
to `/user/login` and one will be returned.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `username` | The username for the merchant account
Yes | `password` | The password for the merchant account

If you delete all your API keys, the login endpoint will generate a new API key
for your account so you aren't locked out.

<aside class="notice">
If you store the key somewhere, just be aware that it can
be used to access and change merchant account settings, including the payout
address. If you're building something like a mobile app where login information
is generally saved, you should store the API key rather than the username and
password. Also consider generating a new API key specific to each device or app.
Always encrypt login credentials when plausible.
</aside>

## Getting Your Merchant ID

> Get the merchant ID for the account:

```js
let result = await axios.get(
  'https://api.gateway.cash/v2/user/merchantid',
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

The merchant ID is passed to the `/pay` endpoint to generate invoices. To
retrieve the merchant ID, send a GET request to `/user/merchantid`.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to the merchant


## Getting Total Sales

> Get total sales information for the merchant account:

```js
let result = await axios.get(
  'https://api.gateway.cash/v2/user/sales',
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

> All values are in units of Satoshi.

To retrieve the total amount ever paid to this merchant, send a GET request to
`/user/sales`.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to the merchant

## Getting Total Contributions

> Retrieve the total contributed to Gateway by this merchant:

```js
let result = await axios.get(
  'https://api.gateway.cash/v2/user/contribution',
  {
    params: {
      APIKey: 'YOUR_API_KEY'
    }
  }
)
```

> A successful response will include a contributionTotal property:

```json
{
  "status": "success",
  ...
  "contributionTotal": 133706969
}
```

> All values are in units of Satoshi.

To retrieve the total amount ever contributed to Gateway by this merchant, send
a GET request to `/user/contribution`.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to the merchant

The response, among other things, will include a field called
`"contributionTotal"`.

## Viewing Your Payments

> Get the first page of payments for your account:

```js
let result = await axios.get(
  'https://api.gateway.cash/v2/user/payments',
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
  "totalPayments": 32,
  "totalPages": 11,
  "resultsPerPage": 3,
  "resultsOffset": 0,
  "currentPage": 1,
  "payments": [
    {
      "status": "complete",
      "paymentAddress":"BITCOIN_CASH_ADDRESS",
      "invoiceAmount":9003,
      "paymentID": "order-fe43dcb493ac",
      "created": "2018-10-22T23:49:53.000Z",
      "privateKey": "hidden",
      "callbackURL": "https://www.ooooooggle.com",
      "callbackStatus": "status-200",
      "platformID": "GATEWAY_PLATFORM_ID",
      "transactions": [
        {
          "type": "payment",
          "TXID": "BITCOIN_CASH_TRANSACTION_ID"
        },
        {
          "type": "transfer-to-merchant",
          "TXID": "BITCOIN_CASH_TRANSACTION_ID"
        }
      ]
    },
    {
      "paymentAddress":"BITCOIN_CASH_ADDRESS",
      "invoiceAmount":9003,
      "status": "complete",
      "paymentID": "order-fe43dcb493ac",
      "created": "2018-10-22T23:49:53.000Z",
      "privateKey": "hidden",
      "transactions": [
        {
          "type": "payment",
          "TXID": "BITCOIN_CASH_TRANSACTION_ID"
        },
        {
          "type": "transfer-to-merchant",
          "TXID": "BITCOIN_CASH_TRANSACTION_ID"
        }
      ]
    },
    {
      "paymentAddress": "BITCOIN_CASH_ADDRESS",
      "invoiceAmount":9003,
      "status": "complete",
      "paymentID": "order-fe43dcb493ac",
      "created": "2018-10-22T23:49:53.000Z",
      "privateKey": "hidden",
      "transactions": [
        {
          "type": "payment",
          "TXID": "BITCOIN_CASH_TRANSACTION_ID"
        },
        {
          "type": "transfer-to-merchant",
          "TXID": "BITCOIN_CASH_TRANSACTION_ID"
        }
      ]
    }
  ]
}
```

To retrieve your payments, send a GET request to `/user/payments`. Since some
merchants have a lot of payments, this endpoint splits them into pages and
allows you to cycle through to find the one you are looking for.

### Parameters

Required | Name | Default | Description
---------|------|---------|------------
Yes | `APIKey` | `N/A` | An active API key belonging to the merchant
No | `includeKeys` | `NO` | Include payment address private keys in the response
No | `includeUnpaid` | `NO` | Include broken, unpaid or half-complete invoices
No | `resultsPerPage` | `25` | The max number of results to send
No | `page` | `1` | The page number

### Return Value

Name | Description
-----|------------
`totalPayments` | The total number of payments in this category for the merchant
`resultsPerPage` | The number of results being sent in the current page
`totalPages` | When pages are this size, this is the total number of needed pages to display all results
`resultsOffset` | The offset of the first payment on the page into the total number of payments. On page 3 with 25 results per page this is 50.
`currentPage` | The current page being displayed
`payments` | An array containing the payments on the current page
`payments[x].paymentAddress` | The address associated with the payment
`payments[x].status` | The current status of the payment
`payments[x].privateKey` | The private key for the payment. Not applicable to XPUB payments
`payments[x].invoiceAmount` | The amount of the invoice from the user's browser
`payments[x].created` | The timestamp when the payment was created
`payments[x].paymentID` | An identifier for the payment
`payments[x].callbackURL` | The callback URL for the payment
`payments[x].callbackStatus` | The status of the callback request
`payments[x].transactions` | An array of transactions associated with this payment
`payments[x].transactions[y].TXID` | The TXID of the transaction
`payments[x].transactions[y].type` | The type of the transaction, generally one of `payment`, `transfer-to-merchant`, `refund` etc.

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
for tracking down issues with your payment invoices.
</aside>

## Getting Payout Method

> Retrieve the payout method:

```js
let result = await axios.get(
  'https://api.gateway.cash/v2/user/payout/method',
  {
    params: {
      APIKey: 'YOUR_API_KEY'
    }
  }
)
```

> Successful results will look as follows:

```json
{
  "status": "success",
  "payoutMethod": "METHOD"
}
```

There are two supported payout methods for Gateway accounts. `"address"` allows
merchants to receive all their payments with a single Bitcoin Cash address,
while `"XPUB"` allows you to specify an extended public key.

To get your payout method, send a GET request to `/user/payout/method`.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to the merchant

## Changing Payout Method

> Update the payout method:

```js
let result = await axios.patch(
  'https://api.gateway.cash/v2/user/payout/method',
  {
    APIKey: 'YOUR_API_KEY',
    newPayoutMethod: 'METHOD'
  }
)
```

> When successful, the new payout method will be sent back:

```json
{
  "status": "success",
  "newPayoutMethod": "METHOD"
}
```

To update the payout method, first make sure you've provided a valid address or
XPUB key, then send a PATCH request to `/user/payout/method`.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to the merchant
Yes | `newPayoutMethod` | The new payout method for the merchant

<aside class="notice">
Valid payout methods are "address" and "XPUB".
</aside>

## Getting Payout Address

> Get the payout address for the merchant account:

```js
let result = await axios.get(
  'https://api.gateway.cash/v2/user/payout/address',
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

To retrieve the payout address, send a GET request to `/user/payout/address`.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to the merchant

<aside class="warning">
If no payout address has ever been associated with this account (the merchant
has only ever used XPUB), the endpoint may return "null" as a response.
</aside>

## Changing Payout Address

> Change the payout address:

```js
let result = await axios.patch(
  'https://api.gateway.cash/v2/user/payout/address',
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

To specify a new payout address for a merchant account, send a PATCH request to
`/user/payout/address`.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to the merchant
Yes | `newAddress` | The new payout address for the merchant

<aside class="notice">
Please provide your Bitcoin Cash address in CashAddress format. If it is given
in any other format, it will be translated prior to being stored in the
database. If we can't understand your address, we can't pay you!
</aside>

## Getting Payout XPUB

> Get the payout XPUB key for the merchant account:

```js
let result = await axios.get(
  'https://api.gateway.cash/v2/user/payout/xpub',
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
  "payoutXPUB": "EXTENDED_PUBLIC_KEY"
}
```

To retrieve the payout XPUB key, send a GET request to `/user/payout/xpub`.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to the merchant

<aside class="warning">
If no XPUB key has ever been associated with this account (the merchant
has only ever used an address), the endpoint may return "null" as a response.
</aside>

## Changing Payout XPUB

> Change the payout XPUB key:

```js
let result = await axios.patch(
  'https://api.gateway.cash/v2/user/payout/xpub',
  {
    APIKey: 'YOUR_API_KEY',
    newXPUB: 'EXTENDED_PUBLIC_KEY'
  }
)
```

> Your new XPUB key will be sent back for confirmation, in addition to the
> address derivation index used for the key, which is generally 0 for new keys.

```json
{
  "status": "success",
  "newXPUB": "EXTENDED_PUBLIC_KEY",
  "XPUBIndex": 0
}
```

Gateway assumes you are using BIP44 derivation for XPUB keys. When your new key
is provided, the XPUB index (the address index in BIP44 derivation) is reset to
0.

To specify a new payout XPUB key for a merchant account, send a PATCH request
to `/user/payout/xpub`.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to the merchant
Yes | `newXPUB` | The new payout XPUB key for the merchant

<aside class="notice">
Valid XPUB keys are around 112 characters in length and begin with "xpub".
Invalid keys will be rejected by the server.
</aside>

## Getting Your Username

> Get the current username for the merchant account:

```js
let result = await axios.get(
  'https://api.gateway.cash/v2/user/name',
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

To return your current username, send a GET request to `/user/name`.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to the merchant

## Changing Your Username

> Change the account username:

```js
let result = await axios.post(
  'https://api.gateway.cash/v2/user/name',
  {
    APIKey: 'YOUR_API_KEY',
    newUsername: 'JohnGalt12'
  }
)
```

> Your new username will be sent back for confirmation. Usernames are converted
> to lower case before being stored in the database.

```json
{
  "status": "success",
  "newUsername": "johngalt12"
}
```

To update your username, send a PATCH request to `/user/name`.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to the merchant
Yes | `newUsername` | The new username for the merchant account

<aside class="notice">
Your username must be between 5 and 24 characters, must be unique, must not
contain spaces/tabs or other odd characters and will be converted to lower case
before being stored in the database.
</aside>

## Changing Your Password

> Change the account password:

```js
let result = await axios.patch(
  'https://api.gateway.cash/v2/user/password',
  {
    APIKey: 'YOUR_API_KEY',
    newPassword: 'B@nk3rSh!llzSkillz#!/bin/sh'
  }
)
```

> Your password will not be sent back for confirmation, so store it safely!
> It's generally a good idea to encrypt credentials when plausible. Passwords
> are always hashed and salted prior to being stored in the database.

```json
{
  "status": "success"
}
```

To set a new password, send a PATCH request to `/user/password`.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to the merchant
Yes | `newPassword` | The new password for the merchant account

<aside class="notice">
The API server does not thoroughly evaluate the security or entropy of provided
passwords. It is the responsibility of the end user and/or the front-end
service provider to ensure that a secure password is provided. Passwords
are always salted and hashed prior to being stored in the database.
</aside>

## Viewing API Keys

> Get a list of all API keys associated with your account:

```js
let result = await axios.get(
  'https://api.gateway.cash/v2/api/keys',
  {
    params: {
      APIKey: 'YOUR_API_KEY'
    }
  }
)
```

> The request will result in a response like this:

```json
{
  "APIKeys": [
    {
      "created": "TIMESTAMP",
      "active": "true",
      "APIKey": "API_KEY",
      "label": "Created at registration"
    },
    {
      "created": "TIMESTAMP",
      "active": "false",
      "APIKey": "API_KEY",
      "label": "Test",
      "revokedDate": "TIMESTAMP"
    }
  ]
}
```

To get a list of the API keys for your account, send a GET request to
`/api/keys`.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to the merchant

<aside class="notice">
For now, all active Gateway API keys have all permissions on the merchant
account. In the future, you will be able to create "read-only" keys and manage
the permissions specific to each key.
</aside>

## Adding an API Key

> Add a new API key:

```js
let result = await axios.put(
  'https://api.gateway.cash/v2/api/key',
  {
    "APIKey": "YOUR_CURRENT_API_KEY",
    "label": "Mobile App"
  }
)
```

> When successful, you will get this back:

```json
{
  "status": "success",
  "newAPIKey": "YOUR_NEW_API_KEY"
}
```

New API keys can be generated by sending a PUT request to `/api/key`.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | A current API key which is active
No | `label` | The label for the new key

You will be able to see your new API key by sending a GET request to
`/api/keys`.

## Deleting an API Key

> Permanently delete an API key:

```js
let result = await axios.delete(
  'https://api.gateway.cash/v2/api/key',
  {
    "APIKey": "YOUR_CURRENT_API_KEY",
    "APIKeyToPermanentlyDelete": "KEY_TO_DELETE"
  }
)
```

> When successful, you will get this back:

```json
{
  "status": "success"
}
```

To permanently delete a key from your account, send a DELETE request to
`/api/key`.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to the merchant
Yes | `APIKeyToPermanentlyDelete` | The key which is to be deleted

## Modifying an API Key

> Deactivate an API key:

```js
let result = await axios.patch(
  'https://api.gateway.cash/v2/api/key',
  {
    "APIKey": "YOUR_CURRENT_API_KEY",
    "action": "deactivate",
    "APIKeyToDeactivate": "KEY_TO_DEACTIVATE"
  }
)
```

> Reactivate an API key:

```js
let result = await axios.patch(
  'https://api.gateway.cash/v2/api/key',
  {
    "APIKey": "YOUR_CURRENT_API_KEY",
    "action": "deactivate",
    "APIKeyToReactivate": "KEY_TO_REACTIVATE"
  }
)
```

> In any case, successful responses will appear as follows:

```json
{
  "status": "success"
}
```

You can update certain aspects of your API key (such as its permissions) by
sending a PATCH request to `/api/key`.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to the merchant
Yes | `action` | The action to be performed (see below)
Sometimes | `APIKeyToDeactivate` | The key to be deactivated
Sometimes | `APIKeyToReactivate` | The key to be reactivated

### Possible Actions

Action | Description
-------|------------
`reactivate` | Reactivates an API key and allows it to be used again
`deactivate` | Deactivates an API key so that it can no longer be used

<aside class="notice">
Gateway has plans to eventually support an API key permissions system. This
will allow for certain keys to have certain rights over an account. For now,
this API endpoint only supports deactivating and reactivating of keys, but will
eventually allow for more advanced operations.
</aside>

# Making Payments

This section covers the process of making and receiving payments with Gateway.
The process is fairly straightforward, and no API keys are required.

## Payment Processing

Payment processing with Gateway is intuitive and simple. Merchants and
developers put PayButtons on their websites and apps so that customers can
generate invoices and make payments for services.

Once the merchant sets up PayButton, the process starts with the customer; when
they click the PayButton, an invoice gets generated and we await their payment.
Once they pay, the receipt is stored with Gateway for the merchant.

## More Details

To make a payment, the customer's browser uses the `POST /pay` API call with
any payment information given to them by the merchant website (`paymentID`,
`callbackURL`, etc). Gateway creates an invoice and responds with an address
(the `paymentAddress`) where the customer can complete their payment.

Once the payment is complete, the customer's browser uses the `POST /paid`
endpoint and sends the `paymentAddress` with the `paymentTXID` back to Gateway.

At this point, the customer is done and can move on with their day. Gateway maks
the payment as pending. Pending payments are processed every 30 seconds by the
`fundsTransferService`.

<aside class="notice">
The Gateway payment processing daemon now runs every 30 seconds! This means a
faster merchant and customer experience as well as lower latency for Gateway
payments.
</aside>

## Funds Transfer Service

The Gateway `fundsTransferService` manages payments sent using the Gateway API.
Every 30 seconds, it checks for and processes payments which have been marked
as `"pending"`.

For each payment marked as pending, `fundsTransferService` will do the
following:

- Check if the payment was made to a merchant who uses XPUB keys. If so,
  call the callbackURL (if provided), update total sales and move on,
  skipping the rest of the steps below.
- Check the `paymentAddress` of the payment for a balance. If there is no
  balance `fundsTransferService` moves to the next payment.
- Retrieve information from the database about the merchant and payment.
- Get the UTXOs associated with `paymentAddress` from a block explorer.
- Deduct Gateway contributions from the payment and send them to Gateway.
- Deduct any platform commissions and send them to the owner of the platform.
- Create a transaction sending the `paymentUTXOs` from `paymentAddress` to the
  merchant's `payoutAddress`.
- Broadcast the transaction to the Bitcoin Cash (BCH) network.
- Set the status of the payment to be `"complete"`
- Increment `totalSales` for the merchant.
- Increment `totalSales` for the platform (if applicable).
- Increment `totalContributed` to the merchant, if the merchant contributes to
  Gateway.
- If a `callbackURL` was provided at the time of the invoice being created,
  execute the callback as documented in the <b>Callback URLs</b> section.

<aside class="notice">
When a merchant uses extended public keys (XPUB) for their payments, Gateway
uses an XPUB-derived merchant address and does not forward the payment.
Merchants always control their keys and do not pay associated transaction fees.
The customer experience is identical.
</aside>

## Broken Payments

When a customer pays an invoice but neglects to call the `POST /paid` endpoint
and mark it as paid, the payment will still eventually arrive at the merchant's
address.

The Gateway Broken Payments Service runs every 12 hours and checks the balances
of all addresses over which Gateway has custody. Any invoices who's payment
addresses have a balance are immediately assigned `"pending"` status
at which point the payment is processed as normal.

## Extended Public Keys (XPUB)

When a merchant sets their payout method to `XPUB` and provides a valid XPUB
key for their account, there is no need for Gateway to forward the payment. The
merchant is always in control of their money, and Gateway never sees the coins.

However, this can create some issues with contributions and Platforms. See the
<b>Registration</b> and <b>Platforms</b> sections for more details.

## Creating an Invoice

> Create a new invoice and generate a payment address:

```js
let result = await axios.post(
  'https://api.gateway.cash/v2/pay',
  {
    merchantID: 'MERCHANT_ID',
    paymentID: 'PAYMENT_ID',
    callbackURL: 'CALLBACK_URL'
  }
)
```

> If successful, you will get back something like this:

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

To open a new invoice with a merchant, send a POST request to `/pay`. Include
their merchant ID in the request and you'll get a payment address back.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `merchantID` | The ID for the merchant for whom the payment is intended
No | `paymentID` | An identifier for the payment which will be shown to the merchant
No | `callbackURL` | See the Callbacks section

<aside class="success">
Nope! You don't need an API key when using this endpoint.
</aside>

<aside class="warning">
Merchants who leverage callback URLs must be careful and make sure to
validate that payments they receive are legitimate. <b>CALLBACK URLS ARE
PUBLIC!!!</b> When you receive a callback from Gateway, it will ALWAYS contain
TXIDs that must be validated by the merchant. <b>Merchants MUST verify these
transactions are valid and that an acceptable amount has been paid to an address
they control before shipping items.</b>
</aside>

## Marking Invoices as Paid

> Send the request with the payment address and TXID:

```js
let result = await axios.post(
  'https://api.gateway.cash/v2/paid',
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

Once an invoice has been paid, send a POST request to `/paid` to give the
payment TXID to the server for processing.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `paymentAddress` | The payment address of the invoice
Yes | `paymentTXID` | The TXID of the transaction which pays the invoice

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

# Gateway Platforms

Gateway Platforms are an innovative way for website operators, service
providers and developers to take commissions from Bitcoin Cash payments. This
section describes how to create, manage and deploy Platforms.

## Overview

In this context, a platform refers to any website where users interact with each
other, with each other's content or where they can buy things. Each project you
work on shouldn't generally require more than one platform, but you can set
commission rules so that certain things apply in certain cases but not others.

On Gateway, each platform has a merchant account designated as its owner. The
owner can set commission rules for the platform and take a percentage of the
earnings as profit.

<aside class="notice">
There are future plans for platforms to be owned by multiple accounts who must
vote and ascent to features. There are also plans for owners to be able to
designate administrators and managers for platforms who have differing
permissions and rights to change certain aspects of a platform.
</aside>

## Platform Users

Platform users are created in the same manner as normal users. See the
<b>Registration</b> section for more info. Include the `platformID` with a
registration request to create a new Platforms user.

The new user will be exclusively owned by the platform and any payments sent to
their `merchantID` will be subject to the commissions of the platform.

<aside class="notice">
No, Platforms users can not create their own platforms. Nice try :)
</aside>

## Creating a Platform

> Create a new platform:

```js
let result = await axios.put(
  'https://api.gateway.cash/v2/platforms',
  {
    APIKey: 'YOUR_API_KEY',
    name: 'FaceHook',
    description: "Hooks people's faces"
  }
)
```

> Successful responses include the new platform ID:

```json
{
  "status": "success",
  "platformID": "NEW_PLATFORM_ID"
}
```

Setting up a Gateway Platform is as simple as sending a PUT request to
`/platforms`.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to the merchant
Yes | `name` | The name of the new platform
No | `description` | The platform description (defaults to "New Platform")

When you create a new platform, the merchant account who's API key was used to
send the PUT request will be made the owner of the new platform. Until they
delegate permission to others, their API key must be used in any request that
deals with the commissions or policies of their new platform.

## Listing Your Platforms

> List your platforms:

```js
let result = await axios.get(
  'https://api.gateway.cash/v2/platforms',
  {
    params: {
      APIKey: 'YOUR_API_KEY'
    }
  }
)
```

> The response will look like this:

```json
{
  "status": "success",
  "numberOfPlatforms": 2,
  "platforms": [
    {
      "created": "CREATED_TIMESTAMP",
      "name": "Platform Name",
      "description": "Platform Description",
      "platformID": "PLATFORM_ID"
    },
    {
      "created": "CREATED_TIMESTAMP",
      "name": "Platform Name",
      "description": "Platform Description",
      "platformID": "PLATFORM_ID"
    }
  ]
}
```

You can send a GET request to `/platforms` to view all platforms to which you
have access.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to the account for which a list of platforms is to be generated

## Changing Platform Settings

> Update the platform name and/or description:

```js
let result = await axios.patch(
  'https://api.gateway.cash/v2/platforms',
  {
    APIKey: 'YOUR_API_KEY',
    platformID: 'YOUR_PLATFORM_ID',
    newName: 'HookFace',
    newDescription: 'Avoid a trademark lawsuit with Mark Zuckerberg'
  }
)
```

> A successful response will look like this:

```json
{
  "status": "success",
  "newName": "NEW_NAME",
  "newDescription": "NEW_DESCRIPTION",
  "platformID": "YOUR_PLATFORM_ID"
}
```

The PATCH `/platforms` endpoint allows you to specify new settings for a
platform. Currently, setting a new name and description are supported.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to someone with permission
Yes | `platformID` | The ID of the platform to be updated
Sometimes | `newName` | A new name for the platform
Sometimes | `newDescription` | A new description for the platform

At least one of `newName` and `newDescription` is required.

<aside class="notice">
There are plans for this endpoint to include support for many other features,
including permissions management, dis/allowing the use of XPUB keys and more.
</aside>

## Commission Rules

Commission rules are directives given to the Gateway payment processing service
which determine when and how much of a commission is taken from which payments,
and where the commission is to be sent.

<aside class="notice">
These features are still being worked on, so there may be cases in which you
don't receive a commission. For example, when the payment is extremely small.
When the merchant contributes to Gateway, Gateway contributions are deducted
prior to commissions payments. Refer to the <b>In Case of Errors</b> subsection
of the <b>Contributing to Gateway</b> section for details.
</aside>

<aside class="notice">
There are plans to support far more advanced commission rules. For example, a
commission of 1.5% might only apply for payments between 50 and 100 euros, where
the paymentID of the payment begins with "electronics-". We expect this will be
extremely useful for inventory management solutions and shopping sites.
</aside>

## Listing Commissions

> Get a list of commissions:

```js
let result = await axios.get(
  'https://api.gateway.cash/v2/commissions',
  {
    params: {
      APIKey: "YOUR_API_KEY",
      platformID: "YOUR_PLATFORM_ID"
    }
  }
)
```

> a successful response will look like this:

```json
{
  "status": "success",
  "numberOfCommissions": 2,
  "commissions": [
    {
      "label": "Federal Gov't Theft",
      "commissionID": "COMMISSION_ID",
      "commissionAmount": "0.00",
      "commissionCurrency": "USD",
      "commissionPercentage": "30.00",
      "commissionLessMore": "more",
      "commissionMethod": "address",
      "commissionXPUB": null,
      "commissionAddress": "COMMISSION_BCH_ADDRESS"
    },
    {
      "label": "State Gov't Theft",
      "commissionID": "COMMISSION_ID",
      "commissionAmount": "0.00",
      "commissionCurrency": "USD",
      "commissionPercentage": "20.00",
      "commissionLessMore": "more",
      "commissionMethod": "XPUB",
      "commissionXPUB": "COMMISSION_XPUB_KEY",
      "commissionAddress": null
    }
  ]
}
```

To get a list of all commissions associated with a platform, send a GET request
to `/commissions`.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to someone with permission
Yes | `platformID` | The ID of the platform for which a list is to be generated

In this example, two commissions are applied to all payments made through this
platform. The first takes 30% of the total and the second takes 20% of the
total. The merchant receives 50% of the total minus transaction fees.

### Return Values

This endpoint returns an array called `"commissions"`. This array contains the
following values for each commission in the array:

Name | Description
-----|------------
`label` | A label for the commission
`commissionID` | A unique identifier for the commission
`commissionAmount` | An amount (in units of `commissionCurrency`) to be charged
`commissionCurrency` | A three-digit currency code
`commissionPercentage` | A percentage value for the commission
`commissionLessMore` | A "less/more" value which determines which of `commissionAmount` and `commissionPercentage` to charge
`commissionMethod` | Method of payout: either `"address"` or `"XPUB"`
`commissionAddress` | The address to which the commission is to be paid
`commissionXPUB` | The XPUB key to which the commission is to be paid

## Adding a Commission

> Add a commission to a platform:

```js
let result = await axios.put(
  'https://api.gateway.cash/v2/commissions',
  {
    "APIKey": "YOUR_API_KEY",
    "platformID": "PLATFORM_ID",
    "commissionLabel": "Sales Tax",
    "commissionAmount": "0",
    "commissionCurrency": "BCH",
    "commissionPercentage": "5.00",
    "commissionLessMore": "more",
    "commissionMethod": "address",
    "commissionAddress": "BITCOIN_CASH_ADDRESS"
  }
)
```

> When successful, the information is sent back along with a new commissionID:

```json
{
  "status": "success",
  "commissionID": "NEW_COMMISSION_ID",
  "platformID": "YOUR_PLATFORM_ID",
  "commissionLabel": "Sales Tax",
  "commisionAddress": "BITCOIN_CASH_ADDRESS",
  "commissionXPUB": null,
  "commissionMethod": "address",
  "commissionAmount": "0",
  "commissionCurrency": "BCH",
  "commissionPercentage": "5.00",
  "commissionLessMore": "more"
}
```

You can add a commission to a platform by sending a PUT request to
`/commissions`.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to someone with permission
Yes | `platformID` | The ID of the platform where the commission should be added
Yes | `commissionLabel` | A label for the new commission
Yes | `commissionAmount` | An amount in units of `commissionCurrency`
Yes | `commissionCurrency` | Three-digit currency code, `BCH` by default
Yes | `commissionPercentage` | A percentage, for example `0.25` for 0.25% or `25` for 25%
Yes | `commissionLessMore` | A less/more value indicating whether the lesser or the greater of commissionAmount or commissionPercentage should be charged
Yes | `commissionMethod` | The payout method, either `"XPUB"` or `"address"`
Sometimes | `commissionAddress` | Required when `commissionMethod` is `"address"`
Sometimes | `commissionXPUB` | Required when `commissionMethod` is `"XPUB"`

<aside class="success">
You can add as many commissions to a single platform as you like. They can all
pay to the same or different addresses, XPUB keys or both.
</aside>

## Changing a Commission

> Update a commission:

```js
let result = await axios.patch(
  'https://api.gateway.cash/v2/commissions',
  {
    "APIKey": "YOUR_API_KEY",
    "newCommissionID": "COMMISSION_ID",
    "newCommissionPercentage": "6.00",
    "newCommissionMethod": "XPUB",
    "newCommissionXPUB": "EXTENDED_PUBLIC_KEY"
  }
)
```

> When successful, the new data will be sent back:

```json
{
  "status": "success",
  "newCommissionLabel": "Sales Tax",
  "newCommisionAddress": "BITCOIN_CASH_ADDRESS",
  "newCommissionXPUB": "EXTENDED_PUBLIC_KEY",
  "newCommissionMethod": "XPUB",
  "newCommissionAmount": "0",
  "newCommissionCurrency": "BCH",
  "newCommissionPercentage": "6.00",
  "newCommissionLessMore": "more"
}
```

You can update a commission by sending a PATCH request to `/commissions`.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to someone with permission
Yes | `commissionID` | The ID of the commission to update
No | `newCommissionLabel` | A new label for the commission
No | `newCommissionAmount` | An amount in units of `newCommissionCurrency`
No | `newCommissionCurrency` | Three-digit currency code, `BCH` by default
No | `newCommissionPercentage` | A percentage, for example `0.25` for 0.25% or `25` for 25%
No | `newCommissionLessMore` | A less/more value indicating whether the lesser or the greater of `newCommissionAmount` or `newCommissionPercentage` should be charged
No | `newCommissionMethod` | The payout method, either `"XPUB"` or `"address"`
Sometimes | `newCommissionAddress` | Required when `newCommissionMethod` is being changed to `"address"`
Sometimes | `newCommissionXPUB` | Required when `newCommissionMethod` is being changed to `"XPUB"`

## Deleting a Commission

> Delete a commission:

```js
let result = await axios.delete(
  'https://api.gateway.cash/v2/commissions',
  {
    "APIKey": "YOUR_API_KEY",
    "commissionID": "COMMISSION_ID"
  }
)
```

> A successful response will look like this:

```json
{
  "status": "success"
}
```

To delete a commission, send a DELETE request to `/commissions`

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to someone with permission
Yes | `commissionID` | The ID of the commission to be deleted

# Contributing to Gateway

When you contribute to Gateway, a portion of each payment made to your merchant
account is deducted and sent to the Gateway donation address. We use these
donations to make Gateway better and to help build new ideas in the Gateway
ecosystem.

If you run a platform, you can add a Gateway contribution option for your
users. Platform user accounts can set contribution settings in the same way as
any other normal Gateway merchant account.

Contributions to Gateway are deducted before platform commissions, so there may
be cases in which the platform commission is not paid since the payment isn't
enough to cover both.

## Contribution Rules

Contribution rules are very similar to the rules used for platform commissions.
They take the form:

"I would like to contribute `{A}`% or `{B}` `{C}`, whichever is `{D}`."

We substitute as follows:

`{A}` = A percentage

`{B}` = An amount (in units if `{C}`)

`{C}` = A three-digit currency code like `BCH`

`{D}` = Either `"less"` or `"more"`

## Getting Contribution Info

> Get current contribution settings for your account:

```js
let result = await axios.get(
  'https://api.gateway.cash/v2/user/contribution',
  {
    params: {
      APIKey: 'YOUR_API_KEY'
    }
  }
)
```

> The above request will return a result like this:

```json
{
  "status": "success",
  "contributionAmount": "0.1",
  "contributionCurrency": "USD",
  "contributionPercentage": "30",
  "contributionLessMore": "less"
}
```

To get current contribution settings for the user, send a GET request to
`/user/contribution`.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to the merchant

## Return Values

The request returns a JSON object with the following parameters:

Parameter | Description
----------|------------
`contributionTotal` | The total ever contributed to Gateway by this user
`contributionAmount` | The amount, in units of `contributionCurrency`, to contribute
`contributionCurrency` | A three-digit currency code. Possible values: `USD`, `EUR`, `JPY`, `CNY` and of course `BCH` which is the default
`contributionPercentage` | A percentage of each payment to send to Gateway
`contributionLessMore` | Indicates whether the lesser or the greater of contributionAmount and contributionPercentage should be contributed

## Updating Contribution Settings

> Set updated contribution settings for your account:

```js
let result = await axios.patch(
  'https://api.gateway.cash/v2/user/contribution',
  {
    APIKey: 'YOUR_API_KEY',
    newContributionAmount: '0.25',
    newContributionCurrency: 'EUR',
    newContributionPercentage: '2',
    newContributionLessMore: 'less'
  }
)
```

> Values are sent back for confirmation:

```json
{
  "status": "success",
  "newContributionAmount": "0.25",
  "newContributionCurrency": "EUR",
  "newContributionPercentage": "2",
  "newContributionLessMore": "less"
}
```

To update the contribution values for a merchant account, send a PATCH request
to `/user/contribution`.

### Parameters

Required | Name | Description
---------|------|------------
Yes | `APIKey` | An active API key belonging to the merchant
No | `newContributionAmount` | The amount, in units of `newContributionCurrency`, to contribute
No | `newContributionCurrency` | A three-digit currency code. Possible values: `USD`, `EUR`, `JPY`, `CNY` and of course `BCH` which is the default
No | `newContributionPercentage` | A percentage of each payment to send to Gateway
No | `newContributionLessMore` | Indicates whether the lesser or the greater of `newContributionAmount` and `newContributionPercentage` should be contributed

If you don't include all four values in your request, the ones included will be
updated and the others will stay  the same. All four values will always be sent
back for confirmation.

## In Case of Errors

Suppose Alice has a merchant account with the following generous contribution
rules:

"I would like to contribute `10`% or `1.00` `USD`, whichever is `more`."

Now, suppose Bob pays Alice `0.13` `USD`. Since `1.00` `USD` (the greater of the
  two values) cannot be deducted from the payment, Alice receives the entire
  payment of `0.13` `USD`.

In another case, if Carol sent Alice a large payment of `1337.00` `USD`, Gateway
would receive `133.70` `USD` and Alice would receive the rest of the payment,
minus transaction fees.

## Contribution Defaults

Gateway will never enable contributions by default. In other words:

"I would like to contribute `0`% or `0` `BCH`, whichever is `less`."

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
  "paymentAddress": "GATEWAY_INVOICE_PAYMENT_ADDRESS",
  "paymentTXID": "CUSTOMER_PAYMENT_TXID"
}
```

When you create a payment button and publish it on the internet (on your
website, a check-out page, a mobile app or a point-of-sale system), your
callback URL becomes public. This means that any malicious customer can see
your callback URL and make illegitimate callbacks.

To solve this rather large problem, Gateway will always and only send a
callback containing information that can (and must) be independently validated
by you.

The Bitcoin Cash payment information, including the payment address and TXIDs
asociated with relevant transactions will be included in legitimate callback
requests.

As the merchant, you must, I repeat <b>MUST VALIDATE that the provided
transaction data satisfies your requirements</B>. TXIDs can be queried from
block explorers or a trusted Bitcoin Cash node. You need to ensure that the
following are true:

- The payment address is either an address derived from your `payoutXPUB` or an
  address generated by Gateway for the payment.
- If you use XPUB, the transaction with `type` of `"payment"` moves an
  amount of BCH <b>acceptable to you as payment for your goods or services</b>
  to an XPUB-derived address which <b>YOU CONTROL!!</b>
- If you use a payout address, the amount transferred to you (minus transaction
  fees) is <b>an acceptable amount of BCH as payment for your goods or
  services</b>.

Gateway has plans to release software that will make this easier in the future,
but for now it may be advisable not to use callback URLs. You may prefer to log
into gateway.cash and manually verify and ship your orders.

Failure to perform these validations <b>will result in hackers defrauding
you</b>.

## Parameters

Legitimate callbacks contain several pieces of information:

Name | Description
-----|------------
`transactions` | An array of transactions pertaining to the payment
`paymentAddress` | The Gateway payment address used by the customer to pay the invoice

<aside class="notice">
The amount of information contained in callbacks is intentionally kept sparse.
In particular, the amount being paid is never sent so that the merchant
validates this information by querying from the Bitcoin Cash network, as they
should.
</aside>
