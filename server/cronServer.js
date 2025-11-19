var alertsService = require('./services/emailAlertHandler');
const cronJobService = require('./services/cronJobService');
const newspaperMagazineCronService = require('./services/cronNewspaperMagazineService');
const genericEmailService = require('./services/genericEmailService');
const guestSearchResetService = require('./services/guestSearchResetService');

var alerts = [{intervalName : '7 minutes', minutes : 7, lastIntervalDate : new Date(0)},
  {intervalName : '20 minutes', minutes : 20, lastIntervalDate : new Date(0)},
  {intervalName : '30 minutes', minutes : 30, lastIntervalDate : new Date(0) },
  {intervalName : '60 minutes', minutes : 60, lastIntervalDate : new Date(0) },
  {intervalName : '24 hours', minutes : 1440, lastIntervalDate : new Date(0) },
  {intervalName : '7 days', minutes : 10080, lastIntervalDate : new Date(0) },
  {intervalName : '14 days', minutes : 20160, lastIntervalDate : new Date(0) },
  {intervalName : '30 days', minutes : 43200, lastIntervalDate : new Date(0) },
];


exports.cronEmailAlerts = function() {
  alerts.forEach(alert => {
    const sendEmail = () => {
      alertsService.emailAlerts(alert.intervalName, alert.lastIntervalDate);
      alert.lastIntervalDate = new Date();
    };
    cronJobService.createCronJob(sendEmail, alert.minutes);
    console.log("started " + alert.intervalName + " cron");

  });
  newspaperMagazineCronService.startCron();
  genericEmailService.startCron();
  guestSearchResetService.startCron();
};
