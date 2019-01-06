/**
 * Displays an error to the user
 * @param  {string} error - The error to display
 */
export default (error) => {
  let errorText = 'An error might be causing problems with '
  errorText += 'your payment. For help, please contact the '
  errorText += 'merchant, or send an email to support@gateway.cash.\n\n'
  errorText += 'If you are the merchant or a developer, you should reference '
  errorText += 'the Gateway Payment Button documentation for help:\n\n'
  errorText += 'https://gateway.cash/docs\n\n'
  if (typeof error !== 'object') {
    errorText += 'The error was:\n\n' + error
    console.error('GATEWAY: Error:\n\n', errorText)
    return errorText
  } else {
    errorText += 'The error was:\n\n' + error.error + '\n\n' + error.description
    console.error('GATEWAY: Error:\n\n', errorText)
    return errorText
  }
}
