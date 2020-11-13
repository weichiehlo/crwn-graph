const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'FG180F',
  password: 'fortinet',
  port: 5432,
});


  const getQueryData = (query) => {
    return new Promise(function(resolve, reject) {
      pool.query(query, (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  }


module.exports = {
    getQueryData
}