"use strict";
const db = require('./dbconnect.js');

module.exports = {

  cleanupMagazineTable: function(Days){
    const insert = 'CALL dc.Magazine_Cleanup(?)';
    const pool = db.getPool();
    const queryParams = [Days];
    queryDB(pool, insert, queryParams).catch(err => { 
      console.log("Couldn't cleanup magazine table");
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
  }).catch(err => {
    throw err; // throw again so the the function who called this function can handle it
  });
}
