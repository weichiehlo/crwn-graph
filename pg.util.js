const Pool = require('pg').Pool



  const getQueryData = ({database, query}) => {
    const pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: database,
      password: 'andy1314520',
      port: 5432,
    });
    return new Promise(function(resolve, reject) {
      pool.query(query, (error, results) => {
        if (error) {
          reject(error)
        }
        results?
        resolve(results.rows)
        :
        resolve([]);
      })
    }) 
  }


module.exports = {
    getQueryData
}