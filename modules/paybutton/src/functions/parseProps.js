import showError from './showError'
import bchaddr from 'bchaddrjs'

/**
 * Formats a string for use as an eval-based client callback
 * @param {String} cb - The callback to format
 */
let formatCallback = cb => {
  if (cb.endsWith(';')) {
    cb = cb.substr(0, cb.length - 1)
  }
  if (!cb.endsWith(')')) {
    cb += '()'
  }
  cb += ';'
}

/**
 * Parses and validates the data given as props to the PayButton
 * @param  {object} - An object containing the props to be parsed
 * @return {object} - Parsed and validated data
 */
export default ({
  buttontext,
  buttonText = 'PAY WITH BITCOIN CASH',
  amount = 0,
  currency = 'BCH',
  dialogtitle,
  dialogTitle = 'Complete Your Payment',
  callbackurl,
  callbackURL,
  paymentid,
  paymentID,
  address,
  merchantid,
  merchantID,
  paymentcompleteaudio,
  paymentCompleteAudio = 'https://gateway.cash/audio/ding.mp3',
  paymentcompletecallback,
  paymentCompleteCallback = 'console.log("GATEWAY: Payment complete!\\n\\nTXID: "+window.gatewayPaymentTXID)',
  closewhencomplete,
  closeWhenComplete = 'no',
  enablepaymentaudio,
  enablePaymentAudio = 'yes',
  hidewalletbutton,
  hideWalletButton = 'no',
  hideaddresstext,
  hideAddressText = 'no',
  elementid,
  elementID = 'pay-' + Math.floor(Math.random() * 100000),
  blockexplorer,
  blockExplorer = 'wss://bch.coin.space',
  gatewayserver,
  gatewayServer = 'https://api.gateway.cash'
}) => {
  let supportedCurrencies = ['BCH', 'USD', 'EUR', 'CNY', 'JPY']

  // assign all lower-case prop names to their correct upper-case counterparts
  buttonText = buttontext || buttonText
  dialogTitle = dialogtitle || dialogTitle
  callbackURL = callbackurl || callbackURL
  paymentID = paymentid || paymentID
  merchantID = merchantid || merchantID
  paymentCompleteAudio = paymentcompleteaudio || paymentCompleteAudio
  paymentCompleteCallback = paymentcompletecallback || paymentCompleteCallback
  closeWhenComplete = closewhencomplete || closeWhenComplete
  enablePaymentAudio = enablepaymentaudio || enablePaymentAudio
  hideWalletButton = hidewalletbutton || hideWalletButton
  elementID = elementid || elementID
  blockExplorer = blockexplorer || blockExplorer
  gatewayServer = gatewayserver || gatewayServer
  hideAddressText = hideaddresstext || hideAddressText

  // APIURL sanity check
  if (!['http://', 'https://'].some(x => gatewayServer.startsWith(x))) {
    return showError('gatewayServer must start with http:// or https://')
  }

  // check the provided API basepoint URL for sanity
  if (!['ws://', 'wss://'].some(x => blockExplorer.startsWith(x))) {
    return showError('blockExplorer must start with ws:// or wss://')
  }

  if (isNaN(amount)) {
    return showError('Currency amount must be a number (decimals are OK)')
  }

  if (amount < 0) {
    return showError('Currency amount must be a positive number')
  }

  // Parse the currency. Default is to use BCH
  if (!supportedCurrencies.some(x => currency === x)) {
    return showError('Currency must be one of', supportedCurrencies)
  }

  // check the callback URL length for sanity
  if (callbackURL && callbackURL.length > 250) {
    return showError('Callback URL must be shorter than 250 characters!')
  }

  // check the protocol of the callback URL for sanity
  if (
    callbackURL &&
    !['http://', 'https://'].some(x => callbackURL.startsWith(x))
  ) {
    return showError('Callback URL does not start with http:// or https://')
  }

  // verify the length of the payment ID for sanity
  if (paymentID && paymentID.length > 64) {
    return showError('The payment ID cannot be longer than 64 characters!')
  }

  // check the direct deposit address for validity, if provided
  if (address) {
    try {
      address = bchaddr.toCashAddress(address)
    } catch (e) {
      return showError('The BCH address provided is invalid!')
    }
  }

  // check the merchant ID for sanity, if one was provided
  if (merchantID && merchantID.length !== 16) {
    return showError('Your Merchant ID needs to be 16 characters!')
  }

  // fail if neither a merchant ID nor an address were provided
  if (!merchantID && !address) {
    return showError('Either address or merchantID is required')
  }

  // format the client-side callback
  paymentCompleteCallback = formatCallback(paymentCompleteCallback)

  // parse hideWalletButton
  hideWalletButton = hideWalletButton === 'yes'

  // parse hideAddressText
  hideAddressText = hideAddressText === 'yes'

  // return the parsed data
  let parsedData = {
    buttonText: buttonText,
    dialogTitle: dialogTitle,
    amount: amount,
    currency: currency,
    merchantID: merchantID,
    paymentID: paymentID,
    callbackURL: callbackURL,
    address: address,
    gatewayServer: gatewayServer,
    blockExplorer: blockExplorer,
    paymentCompleteAudio: paymentCompleteAudio,
    paymentCompleteCallback: paymentCompleteCallback,
    closeWhenComplete: closeWhenComplete,
    enablePaymentAudio: enablePaymentAudio,
    elementID: elementID,
    hideWalletButton: hideWalletButton,
    hideAddressText: hideAddressText
  }
  return parsedData
}
