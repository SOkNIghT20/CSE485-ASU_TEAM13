"use strict";
const db = require('../routes/dbconnect.js');
const fs = require('fs');
const path = require('path');

/**
 * Creates the demo_requests table in the database if it doesn't exist
 * @returns {Promise<boolean>} success status
 */
async function setupDemoRequestsTable() {
  return new Promise((resolve, reject) => {
    console.log('Setting up demo_requests table...');
    
    try {
      // Read the SQL file
      const sqlFilePath = path.join(__dirname, '../../create_demo_requests_table.sql');
      const sql = fs.readFileSync(sqlFilePath, 'utf8');
      
      const connection = db.getPool();
      
      // Execute the SQL to create the table
      connection.query(sql, function(err, result) {
        if (err) {
          console.error('Error creating demo_requests table:', err);
          reject(err);
          return;
        }
        
        console.log('Demo requests table setup completed at ' + new Date().toISOString());
        resolve(true);
      });
    } catch (err) {
      console.error('Error reading SQL file:', err);
      reject(err);
    }
  });
}

module.exports = {
  setupDemoRequestsTable
}; 