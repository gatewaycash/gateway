---
title: PayButton Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - html: HTML
  - javascript: JavaScript

toc_footers:
  - <span>Copyright &copy 2018 Gateway</span>
  - <a href='https://github.com/lord/slate'>Documentation Powered by Slate</a>

search: true
---

# Introduction

> Hello there! This panel provides useful descriptions, annotations and
> examples demonstrating the features of the Gateway.cash payment button. It
> generally shows up on the right-hand side of your screen and will stay lined
> up so that the examples always reference what's being talked about to the
> left. If you don't understand something, glance over and you'll find some
> handy examples.

The Gateway.cash payment button is far more than its name suggests. it provides a powerful and seamless way to integrate highly advanced payment processing features into any number of websites, mobile apps, point-of-sale systems and even IoT devices. The use-cases and possibilities for the button are almost endless. For example, you can use the button below to contribute to the Gateway project:

<script src="/pay.js"></script>
<center>
<div
  class="payButton"
  merchantID="ef0fcea08bfa9cb0"
  buttonText="Donate to Gateway.cash"
  dialogTitle="Make a Donation"
  closeWhenComplete="true"></div>
</center>

<aside class="notice">
Be aware that this documentation is strictly for the payment button. For the
Gateway backend API, you should reference the <a href="https://api.gateway.cash/" target="_blank">Gateway API Documentation</a>.
</aside>

<aside class="warning">
These docs are a work in progress and are not yet complete. If you have
questions, please join the ambassador.cash Discord server and ask your
questions in the #gatewaycash channel.
</aside>

# Including the PayButton on Your Site

There are several ways to use the Gateway PayButton on your site. The easiest
in most cases is probably to include the relevant `<script>` tag on your website.

## Including the Script Tag

> To use the Gateway button injector on your site, include this script tag once
> on each page where you'd like to use PayButton:

```html
<script src="https://gateway.cash/pay.js"></script>
```

The easiest way to get PayButton working is to include the script tag onto your
website. The script will search for any `<div>` tags where `class="payButton"`,
and will attempt to render payment buttons into those `<div>`s.

You may put as many payment buttons on a page as you wish.

## Using the ReactJS Element

> Use the React component like so:

```html
<PayButton
  merchantID="MERCHANT_ID"
  amount="4.99"
  currency="USD"
  buttonText="Buy Now"
/>
```

If your project utilizes the NodeJS/ReactJS ecosystem, you may install and
import the `@gatewaycash/paybutton` package into your project from the NPM
package registry. Once installed, instead of using
`<div class="payButton"></div>`, replace it with `<PayButton>` in ypur project.

## PayButton.render()

```js
window.PayButton.render(
  document.getElementById('example'),
  {
    merchantID: "MERCHANT_ID",
    amount: "4.99",
    currency: "USD"
  }
)
```

When you include the button injector script onto a page, it creates a function
accessible to all JavaScript on the page called `window.PayButton.render()`.

This function can be used to dynamically generate payment buttons and is a
powerful way to integrate without the need for React or another framework.

### Parameters

Name | description
-----|------------
`element` | The DOM element where the button is to be rendered
`props` | A JSON object containing the props to be used with the PayButtton

You may reference the `JSON` tab of the code preview panel for JSON examples
of button properties. The provided examples are formatted for use with the
`window.PayButton.render()` function.

## Hosting Your Own Inject Script

Gateway will make this easier in the future. This is being worked on, but until
it is complete you may simply download the file at `https://gateway.cash/pay.js`
and host it yourself, or clone our
[GitHub repo](https://github.com/gatewaycash/gateway) and compile it from
source.

# Basic Usage

# Console Output

# Errors

> Here are some examples of eronious payment buttons:

```html
<div
  class="payButton"
  merchantID="invalid0invalid"
></div>
```

```javascript
{
  merchantID: "invalid0invalid1"
}
```

As you create and test payment buttons, you may run across errors which can
prevent the buttons from working properly. In some cases, these errors are detectable immediately when the page loads (`load-time`). Other times, an error may not be detected until after the button is clicked (`invoice creation time`).

This is an example of what happens when a `load-time` error occurs:

<div class="payButton" foo="bar"></div>

This is an example of what happens when an error occurs at `invoice creation
time`:

<div class="payButton" merchantID="invalid0invalid1"></div>

# Button Properties

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
