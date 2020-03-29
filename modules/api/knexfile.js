require('dotenv').config()

module.exports = {
  client: 'mysql2',
  connection: {
    host: process.env.SQL_DATABASE_HOST,
    port: process.env.SQL_DATABASE_PORT,
    user: process.env.SQL_DATABASE_USER,
    password: process.env.SQL_DATABASE_PASSWORD,
    database: process.env.SQL_DATABASE_DB_NAME
  }
}
