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
    output: process.stdout,
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
    '\nSQL database hostname (ENTER for 127.0.0.1): ',
  )
  hostname = hostname || '127.0.0.1'

  // get the DB port
  let port = await question(
    'SQL database port (normally 3306) (ENTER for 3306): '
  )
  port = port || '3306'

  // get the username
  let user = await question('SQL user name (ENTER for gateway): ')
  user = user || 'gateway'

  // get the password
  let pass = await question('SQL user password (ENTER for gateway123): ')
  pass = pass || 'gateway123'

  // get the database name
  let db = await question('SQL database name (ENTER for gateway): ')
  db = db || 'gateway'

  // grab the port to host the API on
  let listen = await question('Web server port (ENTER for 8080): ')
  listen = listen || '8080'

  // close the readline stream
  rl.close()
  testDatabaseConnection(hostname, port, user, pass, db, listen)
}

const testDatabaseConnection = async (host, port, user, pass, db, listen) => {
  console.log('\nTesting MySQL credentials...')
  const conn = mysql.createConnection({
    host: host,
    port: port,
    user: user,
    password: pass,
    database: db,
    multipleStatements: true,
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
    console.log('\nSaving your new configuration...')
    fs.writeFile(
      '.env',
      'WEB_PORT=' + listen + '\n' +
      'SQL_DATABASE_HOST=' + host + '\n' +
      'SQL_DATABASE_PORT=' + port + '\n' +
      'SQL_DATABASE_USER=' + user + '\n' +
      'SQL_DATABASE_PASSWORD=' + pass + '\n' +
      'SQL_DATABASE_DB_NAME=' + db + '\n',
      (err) => {
        if (err) {
          console.log('Could not save configuration to modules/api/.env')
          throw err
        } else {
          console.log('New API configuration saved in modules/api/.env')
          setupDatabase(conn)
        }
      },
    )
  })
}

const setupDatabase = async (conn) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  // promisify the readline callback
  rl.question[promisify.custom] = (query) => {
    return new Promise((resolve) => {
      rl.question(query, resolve)
    })
  }
  let question = promisify(rl.question)

  console.log(`
Setting up a new database will erase all data, including users, transactions
and private keys, from the database server you just entered. This action cannot
be undone.

If you are a developer or if this is a new deployment of the database, answer
YES and your new database will be set up automatically.

If you are running a production server or if you already have a working
database you want to keep, answer NO.
`
  )

  let setup = await question(
    'ERASE, set up and format the database for testing? [Y/N]: '
  )

  if (setup === 'N' || setup === 'n' || setup === 'no' || setup === 'NO') {
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

// print some informational text
console.log(
  `The Gateway API server uses a MySQL database to store and manage user
accounts, payments and other data. To set up the API server (required for both
development and production deployments), follow these steps prior to continuing:

1). Install the MySQL Server onto the machine you will use for this  deployment
2). Secure the database, taking care to change the root password
3). Log into the server and create a new database for the deployment
4). Create a new user (DO NOT just use "root"), with read and write permissions
    on the new database
5). Set a secure password for the new user and take any other steps needed to
    ensure the database is secure if it is being used in production
6). When this is complete, enter the information into the prompts on this screen

NOTE: Completing this setup wizard will not automatically wipe the database.
You will be asked if you wish to wipe the database or not after the database
connection is tested. This means that you are free to run this setup wizard
without losing data.`
)
collectInformation()
