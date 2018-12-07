# Gateway Payment Button

The Payment Button for the Internet

## Overview

Payment buttons are a standard and convenient way for merchants to accept
Bitcoin Cash across websites, apps and services.

## Installing and Using

You may use the [gateway.cash](https://gateway.cash) website to create an
account and use the payment ubtton. If you don't want an account with us,
you can also simply pass a BCH address to the button in place of the merchant ID
field.

### Websites

To use the button in a website, simply mirror or include the pay.js injector
as follows:

```HTML
<script src="https://gateway.cash/pay.js"></script>
```

To add buttons to the page, simply use a div with class="PayButton", as follows:

```HTML
<div
  class="PayButton"
  merchantID+"f00ba41111"
  amount="2.99"
  currency="BCH"
></div>
```

### React Applications

For use in React and similar applications, install the @gatewaycash/paybutton
package from the NPM registry. You may then import and use it like any other
React component:

```JavaScript
import PayButton from '@gatewaycash/paybutton'


...
render () => {
  return (
    ...
    <PayButton
      merchantID="f00ba41111"
      amount="4.99"
      currency="EUR"
    />
    ...
  )
}
...
```
