/**
 * Promisified wrapper for the node-mysql library
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defined a promisified wrapper for node-mysql
 */
const mysql = require('mysql')
const promisify = require('util').promisify
require('dotenv').config()

// pull in the MySQL credentials from environment variables
const conn = mysql.createConnection({
  host: process.env.SQL_DATABASE_HOST,
  port: process.env.SQL_DATABASE_PORT,
  user: process.env.SQL_DATABASE_USER,
  password: process.env.SQL_DATABASE_PASSWORD,
  database: process.env.SQL_DATABASE_DB_NAME
})

// promisify the query method
conn.query = promisify(conn.query)

// connect to the database
conn.connect()

// export the promisified functions
module.exports = conn
