# Gateway.cash PayButton

The Payment Button for the Internet

## Overview

Payment buttons are a standard and convenient way for merchants to accept
Bitcoin Cash across websites, apps and services.

You may use the [gateway.cash](https://gateway.cash) website to create an
account and use PayBubtton on your websites. Creating a merchant account allows
you to take advantage of complimentary features like payment tracking, invoice
management and more.

If you don't want an account with Gateway, just pass any BCH address to PayButton in place of the `merchantID` field. More information about passing information to PayButton can be found below.

### Websites

To use the button in a website, simply mirror or include the pay.js injector
as follows:

```HTML
<script src="https://gateway.cash/pay.js"></script>
```

To add buttons to the page, simply use a div with class="PayButton", as follows:

```HTML
<div
  class="payButton"
  merchantID+"deadbeef20181111`"
  amount="2.99"
  currency="USD"
  closeWhenComplete="true"
></div>
```

### React Applications

For use in React and similar applications, install the @gatewaycash/paybutton
package from the NPM registry. You may then import and use it like any other
React component:

```js
import PayButton from '@gatewaycash/paybutton'

export default () => (
  <div>
    <h1>Hi Stranger!</h1>
    <PayButton
      merchantID="deadbeef20181111"
      amount="4.99"
      currency="EUR"
      buttonText="give me free money"
      paymentCompleteCallback="alert('Thanks')"
    />
  </div>
)
```
