/**
 * Promisified wrapper for the node-mysql library
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defined a promisified wrapper for node-mysql
 */
import mysql from 'mysql2'
import util from 'util'
let promisify = util.promisify
import dotenv from 'dotenv'
dotenv.config()

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
//conn.connect() // TODO Why is this commented?

// export the promisified functions
export default conn
