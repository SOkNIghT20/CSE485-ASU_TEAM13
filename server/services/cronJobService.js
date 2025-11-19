"use strict";
const CronJob = require('cron').CronJob;
const timezone = 'America/Denver';

/**
 * Creates a cron job with the specified intervals
 * @param {function} job - the function to run at every interval
 * @param {number} minuteInterval? - number of minutes between each job
 * @param {number} hourInterval? - number of hours between each job
 * @param {number} dayInterval? - number of days between each job
 * @param {number} monthInterval? - number of months between each job
 * @returns {CronJob} the cron jobs
 */
exports.createCronJob = function (job, minuteInterval = 1, hourInterval = 1, dayInterval = 1, monthInterval = 1) {
    const str = `*/${minuteInterval} */${hourInterval} */${dayInterval} */${monthInterval} *`;
    return new CronJob(str, job, null, true, timezone);
};
