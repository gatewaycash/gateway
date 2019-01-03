/**
 * A script to generate test payments
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a script for creating test payments
 */
const readline = require('readline')
const promisify = require('util').promisify
const axios = require('axios')
const sha256 = require('sha256')

// define a main async function so we can use await (called below)
let runTest = async () => {
  // define an input stream
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  // promisify the readline callback
  rl.question[promisify.custom] = (query) => {
    return new Promise((resolve) => {
      rl.question(query, resolve)
    })
  }
  let question = promisify(rl.question)

  // get URL of the payment server to use
  let url = await question(
    'URL for payment server to use (ENTER for http://127.0.0.1:8080): '
  )
  url = url === '' ? 'http://127.0.0.1:8080' : url

  // determine whether to leave the payments as broken (to not call /paid)
  let broken = await question('Leave the payments as broken? (ENTER for no): ')
  broken = (broken.toLowerCase() === 'y' || broken.toLowerCase() === 'yes') ?
    true :
    false

  // determine how many payments to send
  let numberOfPayments = await question(
    'Number of payments to send? (ENTER for 3): '
  )
  numberOfPayments = numberOfPayments === '' ? 3 : numberOfPayments
  numberOfPayments = parseInt(numberOfPayments)

  // get a callback URL
  let callbackURL = await question(
    'Callback URL for your payments (ENTER for none): '
  )

  // get a merchant ID
  let merchantID = await question(
    'Enter a merchant ID (ENTER for deadbeef20181111): '
  )
  merchantID = merchantID === '' ? 'deadbeef20181111' : merchantID

  for(var i = 1; i <= numberOfPayments; i++) {
    console.log('Sending payment', i, 'of', numberOfPayments)

    // generate a random payment ID
    let paymentID = sha256(require('crypto').randomBytes(32)).substr(0, 20)
    let paymentAddress = await axios.post(url + '/pay',
      {
        merchantID: merchantID,
        paymentID: paymentID,
        callbackURL: callbackURL
      })
    console.log(paymentAddress)
    console.log('Received payment address', paymentAddress)
    if (!broken) {

      // generate a random payment TXID
      let paymentTXID = sha256(require('cryotp').randomBytes(32))
      await axios.post(url + '/paid',
        {
          paymentAddress: paymentAddress,
          paymentTXID: paymentTXID
        })
      console.log('Sent receipt with TXID', paymentTXID)
    } else {
      console.log('leaving the payment as broken and moving on')
    }
  }

  console.log('The test has completed.')
  rl.close()
}


runTest()

module.exports = runTest
