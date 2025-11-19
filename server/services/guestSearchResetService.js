"use strict";
const db = require('../routes/dbconnect.js');
const CronJob = require('cron').CronJob;
const timezone = 'America/Denver';

/**
 * Resets all guest search counts in the database
 * @returns {Promise<boolean>} success status
 */
async function resetAllGuestSearchCounts() {
  return new Promise((resolve, reject) => {
    const connection = db.getPool();
    
    connection.query(
      'TRUNCATE TABLE dc.guest_searches',
      function(err, result) {
        if (err) {
          console.error('Error resetting guest search counts:', err);
          reject(err);
          return;
        }
        
        console.log('All guest search counts have been reset at ' + new Date().toISOString());
        resolve(true);
      }
    );
  });
}

module.exports = {
  startCron: function() {
    // Create a cron job that runs at midnight (00:00) every day
    // Cron format: minute hour day month day-of-week
    const resetJob = new CronJob('0 0 * * *', async () => {
      try {
        await resetAllGuestSearchCounts();
      } catch (error) {
        console.error('Error in daily guest search reset cron job:', error);
      }
    }, null, true, timezone);
    
    console.log("Daily guest search reset cron job started");
    return resetJob;
  },
  
  // Export the reset function for direct use
  resetGuestSearchCounts: resetAllGuestSearchCounts
}; 