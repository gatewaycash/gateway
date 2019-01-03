/**
 * Website Environment Setup Script
 * @author The Gateway Project Developers <hello@gateway.cash>
 */
const readline = require('readline')
const fs = require('fs')
const promisify = require('util').promisify

const collectInformation = async () => {

  // create a new readline query stream
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

  // get the backend server URL
  let backend = await question(
    `\nWhich backend server should the website module use?
The production Gateway API is at https://api.gateway.cash
For development, use http://127.0.0.1:8080
( press ENTER for http://127.0.0.1:8080 ): `
  )
  backend = backend || 'http://127.0.0.1:8080'

  fs.writeFile(
    '.env',
    'REACT_APP_GATEWAY_BACKEND=' + backend + '\n',
    (err) => {
      if (err) {
        console.log('Could not save configuration to modules/website/.env')
        throw err
      } else {
        console.log('New website configuration saved in modules/website/.env')
      }
    }
  )

  // close the readline stream
  rl.close()
  console.log('Thank you for helping build Gateway.')
}


collectInformation()
