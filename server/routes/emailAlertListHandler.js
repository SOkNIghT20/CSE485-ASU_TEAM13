"use strict";
const db = require('./dbconnect.js');

module.exports = {
  getAlertList: function(userEmail) {
    const queryParams = [userEmail];
    return callProcedure('Get_Alert_List', queryParams);
  },

  getAlertListCronJob: function(userEmail) {
    return callProcedure('Get_Alert_List_Cron_Job');
  }
};

/**
 * Executes a mysql procedure with given parameters and returns a promise of results
 * @param {string} procedureName - the name of the procedure
 * @param {string} procedureName - optional parameters
 * @return {Promise<*[]>} the rows
 */
function callProcedure( procedureName, parameters = []) {
  var pool = db.getPool();
  return new Promise((resolve, reject) => {

    let argumentHolders = '';
    for (let i = 0; i < parameters.length; i++) {
      argumentHolders += '?';
      if (i != parameters.length - 1) {
        argumentHolders += ',';
      }
    }

    let query = 'CALL dc.' + procedureName + '(' + argumentHolders + ');';

    pool.query(query, parameters, (err, rows) => {
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
