"use strict";
const db = require('./dbconnect.js');

module.exports = {

  getByID: function(articleData){
    const insert = 'CALL dc.Get_Alert_Articles_By_ID(?)';
    const pool = db.getPool();
    return queryDB(pool, insert, articleData);
  }

};

function queryDB(pool, query, queryParams) {
  return new Promise((resolve, reject) => {
    pool.query(query, queryParams, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  })
}
