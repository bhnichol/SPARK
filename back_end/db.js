const sql = require('mssql')
const dbConnection = require('./config/dbConn')

const poolPromise = new sql.ConnectionPool(dbConnection)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
  sql, poolPromise
}