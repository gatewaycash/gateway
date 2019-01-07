---
title: PayButton Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - html: HTML
  - javascript: React
  - json: Render

toc_footers:
  - <span>Copyright &copy 2018 Gateway</span>
  - <a href='https://github.com/lord/slate'>Documentation Powered by Slate</a>

search: true
---

# Gateway.cash PayButton

> Hello there! This panel provides useful descriptions, annotations and
> examples demonstrating the features of PayButton. It generally shows up on
> the right-hand side of your screen and will stay lined up so that the
> examples always reference what's being talked about to the left. If you don't
> understand something, glance over and you'll find some handy explanations to
> get you started.

PayButton by Gateway is far more than its name suggests. It provides a powerful
and seamless way to integrate highly customizable payment processing features
into any number of websites, mobile apps, point-of-sale systems and even IoT
devices. The use-cases and possibilities for PayButton are almost endless. For
example, you can use the button below to contribute to the Gateway project:

<script src="https://gateway.cash/pay.js"></script>
<center>
<div
  class="payButton"
  merchantID="ef0fcea08bfa9cb0"
  buttonText="Donate to Gateway.cash"
  dialogTitle="Make a Donation"
  closeWhenComplete="true"></div>
</center>

<aside class="notice">
These docs outline all the ways PayButton can be customized. If you're just
looking to set up a simple button for your site, head over to
<a href="https://gateway.cash">gateway.cash</a> and make an account. Likewise,
if you're a developer and want to delve deeper into the specifics and semantics
of the Gateway API, the <a href="https://api.gateway.cash">API docs</a> are
your friend.
</aside>

<aside class="warning">
These docs are a work in progress and are not yet complete. If you have
questions, please join the
<a href="https://ambassador.cash">ambassador.cash</a> Discord server and ask
your questions in the #gatewaycash channel.
</aside>

# Principals

PayButton aims to be the de facto standard for Bitcoin Cash payments across the
internet. By providing a wide array of customizable features we can tailor to
the needs of merchants while providing a simple interface for everyone.

## Versitility

In order that PayButton can be used in as many places as possible, we have worked to provide integrations with leading wallets and service providers such as TODO: (WordPress, Shopify, Weebly, Wix and many others.) Check out the
<b>Integrating PayButton</b> section for lots more info.

## Customisability

Merchants, app developers and service providers across numerous industries have
differing needs. From the Apple Watch to Samsung's newest 8K TV, from online
retail to micropayments to vending machines, our goal is to make PayButton the
solution for everyone. That means providing near-endless cuustomizability
through a simple interface at the clock of a button (no pun intended).

## Simplicity

We recognize that every shopkeeper shouldn't need to be a cryptographer in
order to use Bitcoin Cash. Setting things up should be as easy as
`amount="0.99"` or `buttonText="Pay Now"`. Providing experiences that drive
positive feedback will accelerate adoption on a global scale.

## Pioneering the Standard

Our goal is to make every payment a Bitcoin Cash payment, and to make every
Bitcoin Cash payment a PayButton payment. Providing varying degrees of
centralization allows different industries to converge on solutions that best
fit their needs. In all cases, we believe customization is key.

# Integrating PayButton

PayButton can be integrated into a number of environments in a number of ways.
Generally, the easiest and most convenient way for a new merchant to get
started is by simply adding the `<script>` tag to their HTML.

## Script Tag

> To use PayButton, include this script tag once on each page where you'd like
to use PayButton:

```html
<script src="https://gateway.cash/pay.js"></script>
<div
  class="payButton"
  merchantID="YOUR_MERCHANT_ID"
  amount="0.05"
  currency="BCH"
  buttonText="Give Me Free Money"
></div>
```

> The script can be anywhere on the page, in either the <head> or <body> tags.

The easiest way to get PayButton working is to include the script onto your
website. The script will search for any `<div>`s where `class="payButton"`,
and will attempt to render payment buttons into those `<div>`s.

You may reference the `HTML` tab of the code preview panel for examples of using HTML-based PayButtons.

<aside class="success">
You can add as many PayButtons to a page as you wish.
</aside>

## React Component

> From your React application, import PayButton like so:

```javascript
import PayButton from '@gatewaycash/paybutton'

export default () => (
  <PayButton
    merchantID="YOUR_MERCHANT_ID"
    amount="2.49"
    currency="JPY"
  />
)
```

If your project uses React, you may install and import the
`@gatewaycash/paybutton` package from the <a href="https://www.npmjs.com/">
NPM package registry</a>. Once installed, instead of using
`<div class="payButton"></div>`, just use `<PayButton />`.

You may reference the `React` tab of the code preview panel for examples of
React-based PayButtons.

## Render Function

```js
window.PayButton.render(
  'example',
  {
    merchantID: "MERCHANT_ID",
    amount: "4.99",
    currency: "USD",
    buttonText: 'Doe Nate'
  }
)
```

```json
{
  "merchantID": "MERCHANT_ID",
  "amount": "4.99",
  "currency": "USD",
  "buttonText": "Doe Nate"
}
```

The render function is a powerful way to build interactive apps with PayButton
without the need for React. To use the render function, just include the
`<script>` tag like normal. The function becomes available as
`window.PayButton.render( elementID, props )`

### Parameters

Name | description
-----|------------
`elementID` | The ID of a `<div>` where PayButton should be rendered
`props` | A JSON object containing props for the PayButtton

You may reference the `Render` tab of the code preview panel for JSON examples
of `props`. The provided examples are formatted for use with the
`window.PayButton.render()` function.

## Hosting Your Own Inject Script

Gateway will make this easier in the future. This is being worked on, but until
it is complete you may simply download the file at `https://gateway.cash/pay.js`
and host it yourself, or clone our
[GitHub repo](https://github.com/gatewaycash/gateway) and compile it from
source.

# Basic Usage

This section will cover the basics and let you get started experimenting with PayButton in a snap. We'll cover all the ways you can get paid, how to set an amount and basic payment tracking.

## Payment Methods

There are currently two ways merchants can get paid using PayButton: they can
specify a direct deposit address or use a Gateway merchant account.

<aside class="success">
More payment options like extended public keys and BIP47 are coming soon!
</aside>

### Direct Deposit Addresses

> Basic PayButton using a direct deposit address:

```html
<div
  class="payButton"
  address="BITCOIN_CASH_ADDRESS"
/>
```

```javascript
<PayButton
  address="BITCOIN_CASH_ADDRESS"
/>
```

```json
{
  "address": "BITCOIN_CASH_ADDRESS"
}
```

Direct deposit addresses work great for situations like casual donations and
tip jars. If you host a local copy of `https://gateway.cash/pay.js` on your
site, it also becomes completely decentralized.

However, since Gateway doesn't know who is paying which invoices, we can't
provide invoicing or payment tracking when you use a direct deposit address.
Note that this will change when we introduce extended public key support.

<aside class="notice">
Most merchants will prefer to take advantage of a Gateway merchant account.
</aside>

### Gateway Merchant Accounts

> Basic PayButton using a Gateway merchant account:

```html
<div
  class="payButton"
  merchantID="YOUR_MERCHANT_ID"
/>
```

```javascript
<PayButton
  merchantID="YOUR_MERCHANT_ID"
/>
```

```json
{
  "merchantID": "YOUR_MERCHANT_ID"
}
```

When you use a merchant account, Gateway generates new addresses automatically,
keeps track of your payments and forwards the funds to your account payout
address. To get a merchant account, head over to <a href="https://gateway.cash">
gateway.cash</a> and make note of your merchant ID.

## Setting an Amount

> These examples demonstrate the use of "amount" and "currency":

Great! Now you have a PayButton on your site where people can pay you! But how
much? Introducing `amount` and `currency`.

### Amount

The `amount` prop sets the amount of money expected by the merchant for the
payment. The value passed to `amount` is in units of `currency`, which is `BCH` by default.

### Currency

PayButton allows you to set prices in a large number of currencies other than
Bitcoin Cash. When a currency is given, PayButton queries the current price of Bitcoin Cash in order to calculate the correct amount.

# Errors

> Here are some examples of eronious payment buttons:

```html
<div
  class="payButton"
  merchantID="invalid0invalid"
></div>
```

```html
<div
  class="payButton"
  foo="bar"
></div>
```

```javascript
<PayButton
  merchantID="invalid0invalid1"
/>
```

```javascript
<PayButton
  foo="bar"
/>
```

```json
{
  "merchantID": "invalid0invalid1"
}
```

```json
{
  "foo": "bar"
}
```

As you create and test payment buttons, you may run across errors which can
prevent the buttons from working properly. In some cases, these errors are detectable immediately when the page loads (`load-time`). Other times, an error may not be detected until after the button is clicked (`invoice creation time`).

This is an example of what happens when a `load-time` error occurs:

<center>
<div class="payButton" foo="bar"></div>
</center>

This is an example of what happens when an error occurs at `invoice creation
time`:

<center>
<div class="payButton" merchantID="invalid0invalid1"></div>
</center>

## Console Output

Console output can be extremely helpful when diagnosing errors. By default,
console output is turned off but it can be enabled with the
`consoleOutput` prop.

### Possible Values

the `consoleOutput` property can possibly be set to these values:

Value | Description
------|------------
`debug` | Show as much information as possible in console output
`info` | Show general information about the payment and its progress
`none` | Show no information in the console

# Button Props

Button properties are passed as HTML attributes or React `props`. Properties
control the behavior and functionality of your payment button, allowing a wide
array of customization.

## buttonText

## dialogTitle

## merchantID

## address

## currency

## amount

## paymentID

## callbackURL

## paymentCompleteCallback

## closeWhenComplete

## paymentCompleteAudio
