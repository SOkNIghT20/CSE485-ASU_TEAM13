"use strict";
const mysql = require('mysql');
const getConfigInfo = require('../configs/decrypt_credentials.js');

// student db
//const connectionInfo = {
//    host: '192.168.1.154',
//    port: 3306,
//    user: 'root',
//    password: 'DropInn12'
//};

const connectionInfo = getConfigInfo();

// main db
// const connectionInfo = {
//     host: '192.168.1.154',
//     port: 3306,
//     user: 'root',
//     password: 'DropInn12'
// };

const connectionLimit = 10;

let pool;
module.exports = {
    // Use getPool instead of this method if you can
    getConnection: function (err) {
        const connection = mysql.createConnection(connectionInfo);
        connection.connect(err);
        return connection;
    },
    /**
     * Creates a pool to mysql server
     * This should be used over getConnection (unless a single continuous connection is needed)
     * @returns {Pool} - the pool created
     */
    getPool: function () {
        if (pool === undefined) {
            const poolInfo = Object.assign({connectionLimit}, connectionInfo);
            pool = mysql.createPool(poolInfo);
        }
        return pool
    }
};
