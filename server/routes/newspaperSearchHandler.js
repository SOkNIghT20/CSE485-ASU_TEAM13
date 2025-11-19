"use strict";
const db = require('./dbconnect.js');
const _ = require('underscore');

exports.getSearchResults = async function (searchQuery, selectedNewspaper, allPapers, country, allCountries, stateProvince,
                                     allStates, city, allCities, startDateTime, endDateTime, numOfRecords) {
    const query = 'CALL dc.Newspaper_Search(?,?,?,?,?,?,?,?,?,?,?,?)';
    const queryParams = [searchQuery,
        selectedNewspaper,
        allPapers,
        country,
        allCountries,
        stateProvince,
        allStates,
        city,
        allCities,
        startDateTime,
        endDateTime,
        numOfRecords];
    const pool = db.getPool();
    return queryDB(pool, query, queryParams);
};

/**
 * Executes a mysql query and returns a promise containing rows.
 * @param {Pool} pool - the mysql pool to query with
 * @param {string} query - the SQL query
 * @param {Object} queryParams - the parameters for the SQL query
 * @return {Promise<*[]>} the rows
 */
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
