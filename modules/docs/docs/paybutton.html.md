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
<aside>
<center>
<div
  class="payButton"
  merchantID="ef0fcea08bfa9cb0"
  buttonText="Donate to Gateway.cash"
  dialogTitle="Make a Donation"
  closeWhenComplete
  paymentCompleteCallback="alert('Thank you for your donation.')"></div>
</center>
</aside>

<aside class="notice">
These docs outline all the ways PayButton can be customized. If you're just
looking to set up a simple button for your site, head over to
<a href="https://gateway.cash">gateway.cash</a> and make an account. Likewise,
if you're a developer and want to delve deeper into the specifics and semantics
of the Gateway API, the <a href="https://api.gateway.cash">API docs</a> are
your friend.
</aside>

# Principals

PayButton aims to be the de facto standard for Bitcoin Cash payments across the
internet. By providing a wide array of customizable features we can tailor to
the needs of merchants while providing a simple interface for everyone.

## Versatility

In order that PayButton can be used in as many places as possible, we have worked to provide integrations with leading wallets and service providers such as TODO: (WordPress, Shopify, Weebly, Wix and many others.) Check out the
<b>Integrating PayButton</b> section for lots more info.

## Customizability

Merchants, app developers and service providers across numerous industries have
differing needs. From the Apple Watch to Samsung's newest 8K TV, from online
retail to micropayments to vending machines, our goal is to make PayButton the
solution for everyone. That means providing near-endless customizability
through a simple interface at the click of a button (no pun intended).

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

> Switch to the HTML tab to view these examples.
> To use PayButton, include this script tag once on each page where you'd like
> to use PayButton:

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

> The script can be added anywhere on the page.

The easiest way to get PayButton working is to include the script onto your
website. The script will search for any `<div>`s where `class="payButton"`,
and will attempt to render payment buttons into those `<div>`s.

You may reference the `HTML` tab of the code preview panel for examples of using HTML-based PayButtons.

<aside class="success">
You can add as many PayButtons to a page as you wish.
</aside>

## React Component

> Switch to the React tab to view these examples.
> From your React application, import PayButton like so:

```javascript
import PayButton from '@gatewaycash/paybutton'

export default () => (
  <div>
    <h1>Give Me Free Money!</h1>
    <PayButton
      merchantID="YOUR_MERCHANT_ID"
      amount="2.49"
      currency="JPY"
    />
  </div>
)
```

If your project uses React, you may install and import the
`@gatewaycash/paybutton` package from the <a href="https://www.npmjs.com/">
NPM package registry</a>. Once installed, instead of using
`<div class="payButton"></div>`, just use `<PayButton />`.

You may reference the `React` tab of the code preview panel for examples of
React-based PayButtons.

## Render Function

> Switch to the Render tab to view these examples.

```json
window.PayButton.render(
  'example',
  {
    "merchantID": "MERCHANT_ID",
    "amount": "4.99",
    "currency": "USD",
    "buttonText": "Doe Nate"
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

This section will cover the basics and let you get started experimenting with
PayButton. We'll cover all the ways you can get paid, how to set an amount and
basic payment tracking. A brief read-through of this section should get most
merchants up and running in no time!

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

```html
<div
  class="payButton"
  merchantID="YOUR_MERCHANT_ID"
  amount="0.01"
></div>
```

```html
<div
  class="payButton"
  address="BITCOIN_CASH_ADDRESS"
  amount="4.99"
  currency="EUR"
></div>
```

```html
<div
  class="payButton"
  merchantID="YOUR_MERCHANT_ID"
  amount="20"
  currency="USD"
></div>
```

```javascript
<PayButton
  merchantID="YOUR_MERCHANT_ID"
  amount="0.01"
/>
```

```javascript
<PayButton
  address="BITCOIN_CASH_ADDRESS"
  amount="4.99"
  currency="EUR"
/>
```

```javascript
<PayButton
  merchantID="YOUR_MERCHANT_ID"
  amount="20"
  currency="USD"
/>
```

```json
{
  "merchantID": "YOUR_MERCHANT_ID",
  "amount": "0.01"
}
```

```json
{
  "address": "BITCOIN_CASH_ADDRESS",
  "amount": "4.99",
  "currency": "EUR"
}
```

```json
{
  "merchantID": "YOUR_MERCHANT_ID",
  "amount": "20",
  "currency": "USD"
}
```

> Available currencies:

```js
[ 'BCH', 'USD', 'EUR', 'CNY', 'JPY' ]
```

Now you have a PayButton on your site where people can send you money. Great!
But how much should they send? Introducing `amount` and `currency`.

### Amount

The `amount` prop sets the amount of money expected by the merchant for the
payment. The value passed to `amount` is in units of `currency`, which is `BCH`
by default. Setting the amount to `0` or not including an amount prop allows
any amount of BCH to be paid.

### Currency

PayButton allows you to set prices in a large number of currencies other than
Bitcoin Cash. When a currency is given, PayButton queries the current price of
Bitcoin Cash in order to calculate the correct amount.

## Tracking Payments

> Payment IDs help you keep track of which payments come from which buttons:

```html
<div
  class="payButton"
  merchantID="YOUR_MERCHANT_ID"
  paymentID="tesla-donation"
></div>
```

```html
<div
  class="payButton"
  merchantID="YOUR_MERCHANT_ID"
  paymentID="AMZ-054-46657897"
  amount="5.99"
  currency="USD"
  buttonText="Place Order"
></div>
```

```javascript
<PayButton
  merchantID="YOUR_MERCHANT_ID"
  paymentID="tesla-donation"
/>
```

```javascript
<PayButton
  merchantID="YOUR_MERCHANT_ID"
  paymentID="AMZ-054-46657897"
  amount="5.99"
  currency="USD"
  buttonText="Place Order"
/>
```

```json
{
  "merchantID": "YOUR_MERCHANT_ID",
  "paymentID": "tesla-donation"
}
```

```json
{
  "merchantID": "YOUR_MERCHANT_ID",
  "paymentID": "AMZ-054-46657897",
  "amount": "5.99",
  "currency": "USD",
  "buttonText": "Place Order"
}
```

We're getting closer! Now that you understand the different payment methods and
can tell your customers how much to pay, let's learn how to keep track of all
that dough!

Thankfully, this isn't too hard either. To keep track of a payment, just use a
`paymentID`. Think of payment IDs like unique tags that stick to your payment
while it gets zapped across the Bitcoin Cash network.

When you attach a `paymentID` prop to your PayButton, any payments made to that
button will show up with that unique tag. You can check out all the payments
made to your merchant account (including their `paymentID`s) by logging into
<a href="https://gateway.cash">gateway.cash</a> and clicking <b>Payments</b>.

<aside class="success">
If you wanna get fancy, you can also grab all your payments with the
<a href="https://api.gateway.cash/#get-payments">Gateway API</a>!
</aside>

### How is this useful?

Glad you asked! It really depends on the specific application or use-case you
want to accomplish with PayButton. I think a better question might be <b>How
might this be useful for <i>your business</i>?</b> Here are some examples:

- Imagine a website like Amazon that processes millions of orders every day.
  Each order has an order number and payment needs to be received before the
  order can ship. The website sets the `paymentID` for their PayButton equal to
  the order number so they know who paid for what. Since they're so large, the
  site queries the Gateway API directly (or maybe even runs their own Gateway
  servers) rather than logging into Gateway.cash and scrolling for days.
- A not-so-large website sells custom T-shirts and accepts payment with Bitcoin
  Cash. They also set `paymentID` to the order number, but rather than going
  through the hassle of setting up a Gateway server the merchant just logs in
  to see their payments.
- Elon Musk has three websites with PayButtons to accept Bitcoin Cash tips.
  Rather than setting up separate merchant accounts for each site, he uses
  `paymentID` prop values of `tesla`, `spacex` and `boring` respectively. Now,
  when he logs into Gateway, he can tell which sites are generating the most
  donation revenue. He also has the added benefit that all his tips end up in
  the same `payoutAddress` so that he can buy flamethrowers without having to
  move his coins around!

<aside class="warning">
If you use the address prop rather than merchantID, you cannot take advantage of
payment tracking features or callbacks. Sign up for a merchant account to take
advantage of these features!
</aside>

# Errors

> Here are some examples of erroneous payment buttons:

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
prevent the buttons from working properly. In some cases, these errors are
detectable immediately when the page loads (`load-time`). Other times, an error
may not be detected until after the button is clicked (`invoice creation time`).

This is an example of what happens when a `load-time` error occurs:

<aside>
<center>
<div class="payButton" foo="bar"></div>
</center>
</aside>

This is an example of what happens when an error occurs at `invoice creation
time`:

<aside>
<center>
<div class="payButton" merchantID="invalid0invalid1"></div>
</center>
</aside>

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
`none` | Show no information in the console (default)

<aside class="notice">
When your buttons aren't working, errors will always be shown in the console.
</aside>

# Button Props

We've thrown around the word "props" without formally introducing what it
means, but if you're at all familiar with <a href="https://reactjs.org/">React
</a>, you'll already get the idea. Props control the functionality and behavior
of PayButton.

<aside class="success">
All of the below button examples allow you to contribute to the Gateway project!
</aside>

## buttonText

> Change the text on the PayButton with this prop:

```html
<div
  class="payButton"
  merchantID="YOUR_MERCHANT_ID"
  buttonText="Give me free money!"
></div>
```

```javascript
<PayButton
  merchantID="YOUR_MERCHANT_ID"
  buttonText="Give me free money!"
/>
```

```json
{
  "merchantID": "YOUR_MERCHANT_ID",
  "buttonText": "Give me free money!"
}
```

Use the `buttonText` prop to change the text displayed on the clickable
PayButton. By default, `buttonText` is `PAY WITH BITCOIN CASH`. The button text
will always be displayed in upper case.

### Examples

<aside>
<center>
<div
  class="payButton"
  merchantID="ef0fcea08bfa9cb0"></div>
<div
  class="payButton"
  merchantID="ef0fcea08bfa9cb0"
  buttonText="Custom button text"></div>
</center>
</aside>

## dialogTitle

> Change the title displayed on the dialog box:

```html
<div
  class="payButton"
  merchantID="YOUR_MERCHANT_ID"
  buttonText="Send Your Donation"
></div>
```

```javascript
<PayButton
  merchantID="YOUR_MERCHANT_ID"
  dialogTitle="Send Your Donation"
/>
```

```json
{
  "merchantID": "YOUR_MERCHANT_ID",
  "dialogTitle": "Send Your Donation"
}
```

The `dialogTitle` prop sets the title displayed in the payment dialog box. By default, the title is set to `Complete Your Payment`.

### Examples

<aside>
<center>
<div
  class="payButton"
  merchantID="ef0fcea08bfa9cb0"
  buttonText="Default title"></div>
<div
  class="payButton"
  merchantID="ef0fcea08bfa9cb0"
  buttonText="Custom title"
  dialogTitle="Dear mom & Dad Plz Send Money..."></div>
</center>
</aside>

## merchantID

> Merchant IDs allow you to make use of Gateway's payment tracking features:

```html
<div
  class="payButton"
  merchantID="YOUR_MERCHANT_ID"
></div>
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

`merchantID` identifies the merchant for whom the payment is destined. To get
your merchant ID, create an account on <a href="https://gateway.cash">
gateway.cash</a> and find it on your dashboard. When a button uses your
merchant ID, payments made to that button are forwarded to your merchant
account payout address.

## address

> Using a direct deposit address can provide more decentralization and be
> simpler:

```html
<div
  class="payButton"
  address="BITCOIN_CASH_ADDRESS"
></div>
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

If you don't want a Gateway merchant account or want a simpler experience, you
can specify an `address` instead of `merchantID`. All of your payments will go
directly to this address, but you sacrifice the ability to use Gateway's
payment tracking and callback features.

<aside class="notice">
Either a merchantID or an address is required for all PayButtons.
</aside>

## closeWhenComplete

> Closes the dialog when payment is complete:

```html
<div
  class="payButton"
  merchantID="YOUR_MERCHANT_ID"
  closeWhenComplete
></div>
```

```javascript
<PayButton
  merchantID="YOUR_MERCHANT_ID"
  closeWhenComplete
/>
```

```json
{
  "merchantID": "YOUR_MERCHANT_ID",
  "closeWhenComplete": "yes"
}
```

By default, PayButton will show a "Thank You" message when a payment is
successful. With `closeWhenComplete`, you can instead simply close the dialog
box when a successful payment is made.

### Examples

<aside>
<center>
<div
  class="payButton"
  merchantID="ef0fcea08bfa9cb0"
  buttonText="Default behavior"></div>
<div
  class="payButton"
  merchantID="ef0fcea08bfa9cb0"
  buttonText="close when complete"
  closeWhenComplete ></div>
</center>
</aside>

## paymentCompleteAudio

> Use standard audio for PayButton:

```html
<div
  class="payButton"
  merchantID="YOUR_MERCHANT_ID"
  paymentCompleteAudio="bca"
></div>
```

```javascript
<PayButton
  merchantID="YOUR_MERCHANT_ID"
  paymentCompleteAudio="bca"
/>
```

```json
{
  "merchantID": "YOUR_MERCHANT_ID",
  "paymentCompleteAudio": "bca"
}
```

> You can also use a URL instead:

```html
<div
  class="payButton"
  merchantID="YOUR_MERCHANT_ID"
  paymentCompleteAudio="https://gateway.cash/audio/ding.mp3"
></div>
```

```javascript
<PayButton
  merchantID="YOUR_MERCHANT_ID"
  paymentCompleteAudio="https://gateway.cash/audio/ding.mp3"
/>
```

```json
{
  "merchantID": "YOUR_MERCHANT_ID",
  "paymentCompleteAudio": "https://gateway.cash/audio/ding.mp3"
}
```

Using audio to confirm when a payment is successful improves customer
assurance and helps to build a standard payment experience.
`paymentCompleteAudio` lets you customize the audio being played while still
adhering to Bitcoin Cash standards by default.

### Audio Presets

Set `paymentCompleteAudio` to one of these presets for a standard experience:

Name | Description
-----|------------
`bca` | Standard "payment received" sound proposed by Bitcoin Cash Association (default)
`ding` | A simple "ding" sound from FreeSound
`ca_ching` | A cash register sound from FreeSound
`off`, `none`, `no`, or `disabled` | Do not play payment audio

### Audio URLs

You can also set `paymentCompleteAudio` to a URL like
`https://gateway.cash/audio/ding.mp3` in order to get a fully custom experience.

### Examples

<aside>
<center>
<div
  class="payButton"
  merchantID="ef0fcea08bfa9cb0"
  buttonText="Default audio (BCA)"></div>
<div
  class="payButton"
  merchantID="ef0fcea08bfa9cb0"
  buttonText="ding"
  paymentCompleteAudio="ding"></div>
<div
  class="payButton"
  merchantID="ef0fcea08bfa9cb0"
  buttonText="ca_ching"
  paymentCompleteAudio="ca_ching"></div>
<div
  class="payButton"
  merchantID="ef0fcea08bfa9cb0"
  buttonText="no sound"
  paymentCompleteAudio="none"></div>
</center>
</aside>

## enablePaymentAudio

This enables or disables `paymentCompleteAudio`. If you use
`enablePaymentAudio="no"` it is the same as `paymentCompleteAudio="none"`.

### Value

The `enablePaymentAudio` prop should be set to a "yes/no" value. This means
things like `"yes"`, `"no"`, `"on"`, `"off"`, `"true"` and `"false"` will
generally work.

## hideWalletButton

> Remove the wallet button from the UI:

```html
<div
  class="payButton"
  merchantID="YOUR_MERCHANT_ID"
  hideWalletButton
></div>
```

```javascript
<PayButton
  merchantID="YOUR_MERCHANT_ID"
  hideWalletButton
/>
```

```json
{
  "merchantID": "YOUR_MERCHANT_ID",
  "hideWalletButton": "yes"
}
```

By default, when you click a PayButton, the "open wallet" button is visible.
However, there are some situations where this is undesirable such as on PoS
credit card terminals. `hideWalletButton` removes the "open wallet" button from
the user interface which can make for a cleaner experience.

### Examples

<aside>
<center>
<div
  class="payButton"
  merchantID="ef0fcea08bfa9cb0"
  buttonText="Default"></div>
<div
  class="payButton"
  merchantID="ef0fcea08bfa9cb0"
  buttonText="Hidden"
  hideWalletButton ></div>
</center>
</aside>

## hideAddressText

> Remove the address text from the UI:

```html
<div
  class="payButton"
  merchantID="YOUR_MERCHANT_ID"
  hideAddressText
></div>
```

```javascript
<PayButton
  merchantID="YOUR_MERCHANT_ID"
  hideAddressText
/>
```

```json
{
  "merchantID": "YOUR_MERCHANT_ID",
  "hideAddressText": "yes"
}
```

Either for asthetic appeal or to make the dialog box smaller, it may be desirable to hide the actual text of the payment address from the user interface. The `hideAddressText` prop will achieve this purpose.

### Examples

<aside>
<center>
<div
  class="payButton"
  merchantID="ef0fcea08bfa9cb0"
  buttonText="Default"></div>
<div
  class="payButton"
  merchantID="ef0fcea08bfa9cb0"
  buttonText="Hidden"
  hideAddressText ></div>
</center>
</aside>

## disabled

> Disable PayButton like so:

```html
<div
  class="payButton"
  merchantID="YOUR_MERCHANT_ID"
  disabled
></div>
```

```javascript
<PayButton
  merchantID="YOUR_MERCHANT_ID"
  disabled
/>
```

```json
{
  "merchantID": "YOUR_MERCHANT_ID",
  "disabled": "yes"
}
```

You can use the `disabled` prop to disable PayButton. When disabled, nothing happens when it is clicked. This can be useful when using PayButton as a submit button on a form that requires validation.

### Value

The `closeWhenComplete` prop only needs to be present to work. Nothing needs to be passed as a value.

### Examples

<aside>
<center>
<div
  class="payButton"
  merchantID="ef0fcea08bfa9cb0"
  buttonText="Default"></div>
<div
  class="payButton"
  merchantID="ef0fcea08bfa9cb0"
  buttonText="Disabled"
  disabled ></div>
</center>
</aside>

## gatewayServer

> Point PayButton to a custom Gateway server:

```html
<div
  class="payButton"
  merchantID="YOUR_MERCHANT_ID"
  gatewayServer="https://foo.bar"
></div>
```

```javascript
<PayButton
  merchantID="YOUR_MERCHANT_ID"
  gatewayServer="https;//foo.bar"
/>
```

```json
{
  "merchantID": "YOUR_MERCHANT_ID",
  "gatewayServer": "https://foo.bar"
}
```

By default, PayButton use the production gateway.cash server located at
`https://api.gateway.cash`. This is used for things like creating invoices,
resolving `merchantID`s to addresses and marking payments as paid.

if you (TODO: write article) run your own Gateway server for your
website/organization, you can tell PayButton to use that server instead of ours.

## blockExplorer

> Set a custom block explorer WebSocket URL

```html
<div
  class="payButton"
  merchantID="YOUR_MERCHANT_ID"
  blockExplorer="wss://bitcoincash.blockexplorer.com"
></div>
```

```javascript
<PayButton
  merchantID="YOUR_MERCHANT_ID"
  blockExplorer="wss://bitcoincash.blockexplorer.com"
/>
```

```json
{
  "merchantID": "YOUR_MERCHANT_ID",
  "blockExplorer": "wss://bitcoincash.blockexplorer.com"
}
```

PayButton connects to a WebSocket and listens for transactions from a block
explorer, providing instant feedback to the customer when their payment is
received. The `blockExplorer` prop allows you to customize which block explorer
is used when listening for new Bitcoin Cash transactions.

### Default Value

By default, PayButton uses the `bch.coin.space` explorer. Since these ar
WebSocket URLs instead of normal HTTP connections, we use `wss://` instead of
`https://`. Thus, the default value becomes `wss://bch.coin.space`.

## elementID

This is used to set the `id` of the PayButton element when it is rendered to
the DOM. Generally, you shouldn't need to provide a custom value to this prop
and doing so might break things. However, it is used internally in a few places
so if you're a developer you might have an interest in checking it out.

# Callbacks

PayButton callbacks are a powerful way to get notified when a payment goes
through. There are two types of callbacks, namely `callbackURL`s and
`paymentCompleteCallback`s.

The two types of callbacks are designed for two very different things and
should not be used interchangeably. The most convenient way to use PayButton
callbacks might not be the right way to use them. Please read both this
document as well as the section in the
<a href="https://api.gateway.cash/#callback-urls">API docs</a> to avoid getting 
scammed.

<aside class="warning">
Be careful with callbacks! Client-side callbacks can be trivially triggered
from the browser without making a payment and callbackURL requests can be
faked! Don't trust, verify.
</aside>

## callbackURL

> Use the callbackURL prop like so:

```html
<div
  class="payButton"
  merchantID="YOUR_MERCHANT_ID"
  callbackURL="https://example.com/callback.php"
></div>
```

```javascript
<PayButton
  merchantID="YOUR_MERCHANT_ID"
  callbackURL="https://example.com/callback.php"
/>
```

```json
{
  "merchantID": "YOUR_MERCHANT_ID",
  "callbackURL": "https://example.com/callback.php"
}
```

Callback URLs are the <b>ONLY</b> way you should be verifying receipt of a
payment. The callback URL is invoked by the Gateway API server when we process
your payment, but you must remember that it is also public. The callback URL is
generally called after around 30 seconds of the payment being sent by the
customer, except in cases of broken payments which can take up to 24 hours.

### Verify, Verify, Verify!

Just because someone calls your callbackURL does not mean the payment is valid.
You need to verify that a valid `transferTXID` was sent with the request,
moving <b>an acceptable amount</b> of funds to <b>an address you control</b>.
Read <a href="https://api.gateway.cash/#callback-urls">the API docs on callback
URLs</a> before attempting to use them.

<aside class="notice">
Small merchants might find it easier to just log into gateway.cash and check
the <b>Payments</b> page instead of using callbacks.
</aside>

## paymentCompleteCallback

> Use the local, browser-side JavaScript callback like so:

```html
<div
  class="payButton"
  merchantID="YOUR_MERCHANT_ID"
  paymentCompleteCallback="alert('Thanks!')"
></div>
```

```javascript
<PayButton
  merchantID="YOUR_MERCHANT_ID"
  paymentCompleteCallback="alert('Thanks!')"
/>
```

```json
{
  "merchantID": "YOUR_MERCHANT_ID",
  "paymentCompleteCallback": "alert('Thanks!')"
}
```

The paymentCompleteCallback is executed locally in the customer's browser when
a payment is detected from the block explorer. As tempting as it may be to use
this for processing customer payments, doing so would open large security holes
in your application.

Since `paymentCompleteCallback` takes a reference to a JavaScript function as a
parameter, any other code on the page (or even a malicious customer) can simply
execute the JavaScript function without paying first. We recommend using this
only for causmetic animations and other client-side effects.

### Retrieval of the Payment TXID and Payment Address

Before `paymentCompleteCallback` is executed, the `paymentTXID` picked up by
the block explorer is stored in `window.gatewayPaymentTXID`. The
`paymentAddress` is stored in `window.gatewayPaymentAddress` This makes these
variables accessible from within the local callback function.

<aside>
<center>
<div
  class="payButton"
  merchantID="ef0fcea08bfa9cb0"
  buttonText="Local callback example"
  paymentCompleteCallback="alert('TXID: ' + window.gatewayPaymentTXID + '\nAddress: ' + window.gatewayPaymentAddress)"
</center>
</aside>
