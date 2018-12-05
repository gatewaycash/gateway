const readline = require('readline')
const fs = require('fs')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
console.log('\n----------------------------------------')
console.log('Gateway.cash - Development Environment Setup')
console.log('A local SQL database is requied for development.')
console.log('If you do not have one, please set one up now.')
console.log('Always ensure the database is running while you work.')
rl.question('\nSQL database hostname (ENTER for 127.0.0.1): ', (hostname) => {
  hostname = hostname === '' ? '127.0.0.1' : hostname
  rl.question('SQL database user name (ENTER for gateway): ', (user) => {
    user = user === '' ? 'gateway' : user
    rl.question('SQL database user password (ENTER for gateway123): ', (pass) => {
      pass = pass === '' ? 'gateway123' : pass
      rl.question('SQL database name (ENTER for gateway): ', (db) => {
        db = db === '' ? 'gateway' : db
        rl.question('On which port should the API server listen? (ENTER for 8080): ', (listen) => {
          listen = listen === '' ? '8080' : listen
          console.log('Please take this opportunity to mash your keyboard (no spaces).')
          rl.question('Server session secret: ', (secret) => {
            secret = secret === '' ? 'sdfoasjdpfajdfpajdfasd' : secret
            rl.close()
            fs.writeFile(
              '.env',
              'WEB_PORT=' + listen + '\n' +
              'WEB_SESSION_SECRET=' + secret + '\n\n' +
              'SQL_DATABASE_HOST=' + hostname + '\n' +
              'SQL_DATABASE_USER=' + user + '\n' +
              'SQL_DATABASE_PASSWORD=' + pass + '\n' +
              'SQL_DATABASE_DB_NAME=' + db + '\n',
              (err) => {
                if (err) {
                  console.log('Could not save configuration')
                  throw err
                }
                console.log('Your new configuration is saved in the modules/api/.env file.')
                console.log('Thank you for helping build Gateway!')
            })
          })
        })
      })
    })
  })
})
