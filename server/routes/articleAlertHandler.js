"use strict";
const db = require('./dbconnect.js');

module.exports = {

  insertIntoDatabase: function(articleData){
    const insert = 'CALL dc.Insert_Alert_Article(?,?,?)';
    const pool = db.getPool();
    return queryDB(pool, insert, articleData);
  }

};

function queryDB(pool, query, queryParams) {
  return new Promise((resolve, reject) => {
    pool.query(query, queryParams, (err, rows) => {
      if (err) {
        //reject(err);
      } else {
        resolve(rows);
      }
    });
  })
}
