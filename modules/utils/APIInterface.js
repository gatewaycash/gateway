/**
 * Provides a way to interface with the API with the CLI
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Provides an API interface via CLI
 */
const axios = require('axios')
const readline = require('readline')
let promisify = require('util').promisify

let state = 'setAPIBase'
let currentAPIKey = false
let APIBase = 'http://127.0.0.1:8080'

let stdin = process.stdin
stdin.setRawMode(true)
stdin.resume()
stdin.setEncoding('utf8')

// define an input stream
let rl = readline.createInterface({
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

stdin.on( 'data', (key) => {

  // exit when ctrl + c is pressed
  if ( key === '\u0003' ) {
    setState('quit')
  }

  // based on the current state, take certain actions based key press
  switch (state) {

    // things that are possible from the main menu
    case 'mainMenu':

      // use these options when not logged in
      if (currentAPIKey === false) {
        switch (key) {
          case '1':
            setState('loginScreen')
            break
          case '2':
            setState('registerScreen')
            break
          case '3':
            setState('testPayments')
            break
          case '4':
            setState('quit')
        }

      // use these options when logged in
      } else {
        switch (key) {
          case '1':
            setState('setUsernameScreen')
            break
          case '2':
            setState('setAddressScreen')
            break
          case '3':
            setState('testPayments')
            break
          case '4':
            setState('logOut')
            break
          case '5':
            setState('quit')
        }
      }
      break

    // things that are possible from the login screen
    case 'loginScreen':
      switch (key) {
        case '1':
          setState('loginByAddress')
          break
        case '2':
          setState('loginByUsername')
          break
        case '3':
          setState('mainMenu')
      }
      break
    case 'awaitSpace':
      if (key == ' ') {
        setState('mainMenu')
      }
  }
})

/**
 * Updates the state variable and displays the appropriate menu
 * @param  {string}  newState - The state to change to
 * @return {Promise}
 */
let setState = async (newState) => {
  state = newState
  switch (state) {
    case 'mainMenu':
      await mainMenu()
      break
    case 'loginScreen':
      loginScreen()
      break
    case 'loginByAddress':
      await loginByAddress()
      break
    case 'loginByUsername':
      await loginByUsername()
      break
    case 'registerScreen':
      await registerScreen()
      break
    case 'testPayments':
      await testPayments()
      break
    case 'setAPIBase':
      await setAPIBase()
      break
    case 'logOut':
      currentAPIKey = false
      setState('mainMenu')
      break
    case 'quit':
      console.log('Thank you for using the Gateway CLI. Goodbye!')
      process.exit()
  }
}

let mainMenu = async () => {
  console.log('\033c')
  console.log('Gateway API Interface - Main Menu')

  // show the welcome menu when not logged in
  if (currentAPIKey === false) {
    console.log('[1] Log Into Gateway')
    console.log('[2] Register for a Gateway Account')
    console.log('[3] Send test payments')
    console.log('[4] Quit')

  // show the main menu when logged in, after getting information
  } else {
    // get information about the account
    let merchantAddress = await axios.get(APIBase + '/address', {
      params: {
        APIKey: currentAPIKey
      }
    })
    merchantAddress = merchantAddress.data.payoutAddress
    let merchantID = await axios.get(APIBase + '/merchantid', {
      params: {
        APIKey: currentAPIKey
      }
    })
    merchantID = merchantID.data.merchantID
    let merchantUsername = await axios.get(APIBase + '/username', {
      params: {
        APIKey: currentAPIKey
      }
    })
    merchantUsername = merchantUsername.data.username
    let merchantTotalSales = await axios.get(APIBase + '/totalsales', {
      params: {
        APIKey: currentAPIKey
      }
    })
    merchantTotalSales = merchantTotalSales.data.totalSales
    console.log('Account Information:')
    console.log('Merchant ID:', merchantID)
    console.log('Total Sales:', merchantTotalSales)
    console.log('Payout Address:', merchantAddress)
    console.log('Username:', merchantUsername)
    console.log('[1] Change your Username')
    console.log('[2] Change your Address')
    console.log('[3] Send test payments')
    console.log('[4] Log Out')
    console.log('[5] Quit')
  }
}

let loginScreen = () => {
  console.log('\033c')
  console.log('Gateway API Interface - Log In')
  console.log('[1] Log In by Address')
  console.log('[2] Log In by Username')
  console.log('[3] Back')
}

let loginByAddress = async () => {
  // get the login details
  let address = await question('Enter your Bitcoin Cash address: ')
  let password = await question('Enter your password: ')

  // make the request
  let result = await axios.get(APIBase + '/login', {
    params: {
      address: address,
      password: password
    }
  })

  if (result.data.status === 'error') {
    displayError(result.data)
  } else {
    currentAPIKey = result.data.APIKey
    setState('mainMenu')
  }
}

let loginByUsername = async () => {
  // get the login details
  let username = await question('Enter your Gateway.cash Username: ')
  let password = await question('Enter your password: ')

  // make the request
  let result = await axios.get(APIBase + '/login', {
    params: {
      username: username,
      password: password
    }
  })

  if (result.data.status === 'error') {
    displayError(result.data)
  } else {
    currentAPIKey = result.data.APIKey
    setState('mainMenu')
  }
}

let setAPIBase = async () => {
  // get the new API base URL
  console.log('Enter the address of the Gateway server to use.')
  console.log('By default the address is', APIBase, 'for development.')
  console.log('For the production Gateway.cash API, use')
  console.log('https://api.gateway.cash')
  let newAPIBase = await question('New API Base URL (ENTER for default): ')
  APIBase = newAPIBase === '' ? APIBase : newAPIBase
  setState('mainMenu')
}

let displayError = (error) => {
  console.log('An API error occurred:')
  console.log('\n', error.error)
  console.log('\n', error.description)
  console.log('\nPress the space bar to continue')
  setState('awaitSpace')
}

setState('setAPIBase')
