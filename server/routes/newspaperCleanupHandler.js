"use strict";
const db = require('./dbconnect.js');

module.exports = {

  cleanupNewspaperTable: function(Days){
    const insert = 'CALL dc.Newspaper_Cleanup(?)';
    const pool = db.getPool();
    const queryParams = [Days];
    queryDB(pool, insert, queryParams).catch(err => {
      console.log("Couldn't cleanup newspaper table");
      console.error(err);
    });
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
  }).catch((err)=>{
    console.log(err);
  });
}
