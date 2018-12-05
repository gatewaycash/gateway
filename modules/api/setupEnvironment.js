const readline = require('readline')
const fs = require('fs')
const mysql = require('mysql')

console.log('\n----------------------------------------')
console.log('Gateway.cash - API module setup assistant')
console.log('A local SQL database is requied for API development.')
console.log('If you do not have one, please set one up now.')
console.log('Always ensure the database is running while you work.')

const collectInformation = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

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
            testDatabaseConnection(hostname, user, pass, db, listen, secret)
          })
        })
      })
    })
  })
})
}

const testDatabaseConnection = (host, user, pass, db, listen, secret) => {
  console.log('Testing MySQL credentials...')
  const conn = mysql.createConnection({
    host: host,
    user: user,
    password: pass,
    database: db
  })
  conn.connect((err) => {
    if (err) {
      console.log('Error connecting to database!')
      console.log('Check your credentials and try again.')
      console.log('For help setting up a MySQL database, please see here:')
      console.log('https://dev.mysql.com/doc/refman/8.0/en/installing.html')
      collectInformation()
    } else {
      console.log('Your MySQL credentials look good!')
      console.log('Saving your new configuration...')
      fs.writeFile(
        '.env',
        'WEB_PORT=' + listen + '\n' +
        'WEB_SESSION_SECRET=' + secret + '\n\n' +
        'SQL_DATABASE_HOST=' + host + '\n' +
        'SQL_DATABASE_USER=' + user + '\n' +
        'SQL_DATABASE_PASSWORD=' + pass + '\n' +
        'SQL_DATABASE_DB_NAME=' + db + '\n',
        (err) => {
          if (err) {
            console.log('Could not save configuration')
            throw err
          } else {
            console.log('New API configuration saved in modules/api/.env')
            console.log('Thank you for helping build Gateway!')
          }
        }
      )
    }
  })
}

collectInformation()
