const CronJobService = require('./cronJobService');
const newspaperParser = require("./../parser/newspaperParser");
const magazineParser = require("./../parser/magazineParser");

const DAYS_FOR_CLEANUP = 31;

module.exports = {
  startCron: function() {
    // Creates a crontab that runs the newspaper parser/cleaner once every hour
    CronJobService.createCronJob(newspaperParser.runParser(DAYS_FOR_CLEANUP), 60);
    CronJobService.createCronJob(magazineParser.runParser(DAYS_FOR_CLEANUP), 60);
    console.log("Newspaper hourly parser cron started");
    console.log("Magazine hourly parser cron started");

  }
};

