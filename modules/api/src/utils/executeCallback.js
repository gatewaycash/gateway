/**
 * Executes callbacks when payments were successfully completed
 * @author The Gateway Project Developers <hello@gateway.cash>
 */
import axios from 'axios'

export default async (callbackURL, params) => {
  if (
    !callbackURL ||
    callbackURL === '' ||
    callbackURL === 'None' ||
    callbackURL == 0
  ) {
    console.log('No callback URL provided')
    return
  }

  // verify the callback URL is sane
  if (
    !callbackURL.startsWith('https://') &&
    !callbackURL.startsWith('http://')
  ) {
    console.log(
      'Callback URL is invalid:',
      callbackURL
    )
    return
  }

  // try to execute the callback
  try {
    await axios.post(callbackURL, params)
    console.log(
      'Successfully executed callback to URL:',
      callbackURL
    )
  } catch (e) {
    console.error(
      'Unable to execute callback to URL:',
      callbackURL
    )
  }
}
