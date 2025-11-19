"use strict";
const db = require('./dbconnect.js');

module.exports = {
    getFeeds: function() {
      const query = 'CALL dc.Get_Newspaper_Feeds()';
      const pool = db.getPool();
      return queryDB(pool, query).catch(err => {throw err});
    }
  };

/**
 * Executes a mysql query and returns a promise containing rows.
 * @param {Pool} pool - the mysql pool to query with
 * @param {string} query - the SQL query
 * @return {Promise<*[]>} the rows
 */
function queryDB(pool, query) {
  return new Promise((resolve, reject) => {
    pool.query(query,(err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  }).catch((err)=>{
    throw err; // throw again so the the function who called this function can handle it
  });
}
