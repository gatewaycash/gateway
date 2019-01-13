import showError from './showError'
import bchaddr from 'bchaddrjs'

/**
 * Formats a string for use as an eval-based client callback
 * @param {String} cb - The callback to format
 */
let formatCallback = cb => {
  if (!cb || cb === '' || cb.length < 1) {
    return ''
  }
  if (cb.endsWith(';')) {
    cb = cb.substr(0, cb.length - 1)
  }
  if (!cb.endsWith(')')) {
    cb += '()'
  }
  cb += ';'
  return cb
}

/**
 * Parses a boolean intention from a string
 * @param {String} intent - The intention string to format
 */
let parseBool = intent => {
  if (typeof intent === 'string') {
    intent = intent.toLowerCase()
  }
  if (
    intent === true ||
    intent === 1 ||
    intent === '1' ||
    intent === 'enabled' ||
    intent === 'enable' ||
    intent === 'on' ||
    intent === 'yes' ||
    intent === 'true'
  ) {
    return true
  } else if (
    intent === false ||
    intent === 0 ||
    intent === '0' ||
    intent === 'disabled' ||
    intent === 'disable' ||
    intent === 'off' ||
    intent === 'no' ||
    intent === 'false' ||
    intent === 'none' ||
    intent === undefined ||
    intent === null
  ) {
    return false
  } else {
    throw {
      message: 'Unknown intention'
    }
  }
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
  paymentCompleteAudio = 'bca',
  paymentcompletecallback,
  paymentCompleteCallback,
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
  gatewayServer = 'https://api.gateway.cash',
  consoleoutput,
  consoleOutput = 'none'
}) => {
  let supportedCurrencies = ['BCH', 'USD', 'EUR', 'CNY', 'JPY']
  let paymentAudioPresets = {
    bca: 'https://raw.githubusercontent.com/The-Bitcoin-Cash-Fund/Branding/master/Bitcoin_Cash/Audio/BCH_Payment_Receive_Audio.wav',
    ding: 'https://gateway.cash/audio/ding.mp3',
    ca_ching: 'https://gateway.cash/audio/ca-ching.wav'
  }

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
  consoleOutput = consoleoutput || consoleOutput

  // validate gatewayServer
  if (!['http://', 'https://'].some(x => gatewayServer.startsWith(x))) {
    return showError('gatewayServer must start with http:// or https://')
  }

  // validate blockExplorer
  if (!['ws://', 'wss://'].some(x => blockExplorer.startsWith(x))) {
    return showError('blockExplorer must start with ws:// or wss://')
  }

  // validate amount
  if (isNaN(amount)) {
    return showError('Currency amount must be a number (decimals are OK)')
  }
  if (amount < 0) {
    return showError('Currency amount must be a positive number')
  }

  // validate currency
  if (!supportedCurrencies.some(x => currency === x)) {
    return showError('The given currency is not supported')
  }

  // validate callbackURL
  if (callbackURL && callbackURL.length > 250) {
    return showError('Callback URL must be shorter than 250 characters!')
  }
  if (
    callbackURL &&
    !['http://', 'https://'].some(x => callbackURL.startsWith(x))
  ) {
    return showError('Callback URL does not start with http:// or https://')
  }

  // validate paymentID
  if (paymentID && paymentID.length > 64) {
    return showError('The payment ID cannot be longer than 64 characters!')
  }

  // validate address if given
  if (address) {
    try {
      address = bchaddr.toCashAddress(address)
    } catch (e) {
      return showError('The BCH address provided is invalid!')
    }
  }

  // validate merchantID if given
  if (merchantID && merchantID.length !== 16) {
    return showError('Your merchantID needs to be 16 characters!')
  }

  // fail if no merchantID and no address
  if (!merchantID && !address) {
    return showError('Either address or merchantID is required')
  }

  // format the client-side callback
  paymentCompleteCallback = formatCallback(paymentCompleteCallback)

  // parse hideWalletButton
  try {
    hideWalletButton = parseBool(hideWalletButton)
  } catch (e) {
    return showError('hideWalletButton needs to be a yes/no value')
  }

  // parse hideAddressText
  try {
    hideAddressText = parseBool(hideAddressText)
  } catch (e) {
    return showError('hideAddressText needs to be a yes/no value')
  }

  // parse enablePaymentAudio
  try {
    enablePaymentAudio = parseBool(enablePaymentAudio)
  } catch (e) {
    return showError('enablePaymentAudio must be a yes/no value')
  }
  if (
    paymentCompleteAudio === 'off' ||
    paymentCompleteAudio === 'none' ||
    paymentCompleteAudio === 'no' ||
    paymentCompleteAudio === 'disabled'
  ) {
    enablePaymentAudio = false
  }

  // parse paymentCompleteAudio
  if (enablePaymentAudio) {
    if (!['http://', 'https://'].some(x => paymentCompleteAudio.startsWith(x))){
      paymentCompleteAudio = paymentAudioPresets[paymentCompleteAudio]
      if (paymentCompleteAudio === undefined) {
        return showError('paymentCompleteAudio is not a valud URL or preset')
      }
    }
  }

  // parse closeWhenComplete
  try {
    closeWhenComplete = parseBool(closeWhenComplete)
  } catch (e) {
    return showError('closeWhenComplete must be a yes/no value')
  }

  // validate the consoleOutput prop
  consoleOutput = consoleOutput.toLowerCase()
  if (
    consoleOutput !== 'none' &&
    consoleOutput !== 'info' &&
    consoleOutput !== 'debug'
  ) {
    return showError('consoleOutput must be one of "debug", "info" or "none"')
  }

  // verify that payment tracking is not attempted with direct deposit address
  if (address) {
    if (
      paymentID ||
      merchantID ||
      callbackURL ||
      paymentCompleteCallback !== '' ||
      gatewayServer !== 'https://api.gateway.cash'
    ) {
      return showError(
        'When a direct deposit address is used, payment tracking and callbacks are not supported because Gateway does not know which transactions belong to which button clicks. Use a Gateway merchant account and a merchantID to enable this, and host a Gateway server if concerned about trust. Specifically, paymentID, merchantID, callbackURL, paymentCompleteCallback and gatewayServer cannot be used if address is being used.'
      )
    }
    enablePaymentAudio = false
  }

  return {
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
    hideAddressText: hideAddressText,
    consoleOutput: consoleOutput
  }
}
