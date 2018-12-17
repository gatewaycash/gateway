/**
 * API Environment Setup Script
 * @author The Gateway Project Developers <hello@gateway.cash>
 */
const readline = require('readline')
const fs = require('fs')
const mysql = require('mysql')
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

  // get the hostname
  let hostname = await question(
    '\nSQL database hostname (ENTER for 127.0.0.1): '
  )
  hostname = hostname === '' ? '127.0.0.1' : hostname

  // get the username
  let user = await question('SQL user name (ENTER for gateway): ')
  user = user === '' ? 'gateway' : user

  // get the password
  let pass = await question('SQL user password (ENTER for gateway123): ')
  pass = pass === '' ? 'gateway123' : pass

  // get the database name
  let db = await question('SQL database name (ENTER for gateway): ')
  db = db === '' ? 'gateway' : db

  // grab the port to host the API on
  let listen = await question('Web server port (ENTER for 8080): ')
  listen = listen === '' ? '8080' : listen

  // close the readline stream
  rl.close()
  testDatabaseConnection(hostname, user, pass, db, listen)
}

const testDatabaseConnection = async (host, user, pass, db, listen) => {
  console.log('Testing MySQL credentials...')
  const conn = mysql.createConnection({
    host: host,
    user: user,
    password: pass,
    database: db,
    multipleStatements: true
  })
  conn.connect((err) => {
    if (err) {
      console.log('Error connecting to database!')
      console.log('Check your credentials and try again.')
      console.log('For help setting up a MySQL database, please see here:')
      console.log('https://dev.mysql.com/doc/refman/8.0/en/installing.html')
      collectInformation()
      return
    }

    console.log('Your MySQL credentials look good!')
    console.log('Saving your new configuration...')
    fs.writeFile(
      '.env',
      'WEB_PORT=' + listen + '\n' +
      'SQL_DATABASE_HOST=' + host + '\n' +
      'SQL_DATABASE_USER=' + user + '\n' +
      'SQL_DATABASE_PASSWORD=' + pass + '\n' +
      'SQL_DATABASE_DB_NAME=' + db + '\n',
      (err) => {
        if (err) {
          console.log('Could not save configuration to modules/api/.env!')
          throw err
        } else {
          console.log('New API configuration saved in modules/api/.env!')
          setupDatabase(conn)
        }
      }
    )
  })
}

const setupDatabase = async (conn) => {
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

  console.log('\nSetting up a new database will OVERWRITE any existing data')
  console.log('stored in the current database. THIS ACTION CANNOT BE UNDONE.')
  console.log('If you have just created the database and are setting it up for')
  console.log('development for the first time, you need to set it up before')
  console.log('starting development.\n')
  let setup = await question('Set up a new test database? [Y/N]: ')

  if (
    setup === 'N' ||
    setup === 'n' ||
    setup === 'no' ||
    setup === 'NO'
  ) {
    rl.close()
    conn.end()
    console.log('Thank you for helping build Gateway.')
  } else if (
    setup === 'Y' ||
    setup === 'y' ||
    setup === 'yes' ||
    setup === 'YES'
  ) {
    console.log('Setting up a new test database...')
    const readFile = promisify(fs.readFile)
    let data
    try {
      data = await readFile('SQLSetup.sql', 'utf8')
    } catch (e) {
      console.log('Could not open the SQLSetup.sql file!')
      return
    }
    conn.query = promisify(conn.query)
    try {
      await conn.query(data)
    } catch (e) {
      console.log('Error executing the code from SQLSetup.sql!')
      return
    }
    rl.close()
    conn.end()
    console.log('Your test database has been successfully created!')
    console.log('Thank you for helping build Gateway.')
  } else {
    console.log('Please answer with either "Y" or "N"')
    rl.close()
    setupDatabase(conn)
  }
}

collectInformation()
