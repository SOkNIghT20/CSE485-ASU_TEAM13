const express = require('express');
const path = require('path');
// var favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const passport = require('passport');
const users = require('./routes/users');
const tvSearch = require('./routes/tvSearch');
const getChannels = require('./routes/getChannels');
const getNewspapers = require('./routes/getNewspapers');
const getMagazines = require('./routes/getMagazines');
const getRadios = require('./routes/getRadios');
const getCountries = require('./routes/getCountries');
const getStates = require('./routes/getStates');
const getCities = require('./routes/getCities');
const updateRadio = require('./routes/updateRadio');
const updateLocation = require('./routes/updateLocations');
const updateNewspapers = require('./routes/updateNewspapers');
const updateMagazines = require('./routes/updateMagazines');
const addRadio = require('./routes/addRadio');
const addNewspaper = require('./routes/addNewspaper');
const addMagazine = require('./routes/addMagazine');
const addEmailAlert = require('./routes/addEmailAlert');
const simpleSearch = require('./routes/simpleSearch');
const orders = require('./routes/orders');
const admin = require('./routes/admin');
const streamVideo = require('./routes/streamVideo');
const additionalcc = require('./routes/additionalCC');
const generatePDF = require('./routes/generatePDF');
const generateDocx = require('./routes/generateDocx');
const generateHtml = require('./routes/generateHtml');
const generateXlsx = require('./routes/generateXlsx');
const generateZip = require('./routes/generateZip');
const downloadMedia = require('./routes/downloadMedia');
const sendPage = require('./routes/sendPage');
const sendemail = require('./routes/sendemail');
const emailAlert = require('./routes/emailAlert');
const newEmailAlert = require('./routes/emailAlert');
const sendForm = require('./routes/sendForm');
const getCompanyName = require('./routes/getCompanyName');
const multer = require('multer');
const app = express();
const videoEditor = require('./routes/videoEditor');
const guestSearchCount = require('./routes/guestSearchCount');
const demoRequests = require('./routes/demoRequests');
const mediaTransfer = require('./routes/media-transfer-api')
// Allows cross domain requests to be made from the frontend.
app.use(function(req, res, next) {
    const origin = req.headers.origin;
    res.header("Access-Control-Allow-Origin", origin); // Dynamically allow origin
    res.header("Access-Control-Allow-Credentials", "true"); // Allow credentials
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
    // Handle preflight requests (CORS pre-check)
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
  
    next();
  });  

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
//app.use('/users',userx);

//app.use(express.static('/mnt/d0ad5531-639d-4328-a763-ea432a61bcce'));
//server.use(express.static('./'));
app.use(express.static('uploads'));
app.use('/', users);
app.use('/', tvSearch);
app.use('/', simpleSearch);
app.use('/', orders);
app.use('/', admin);
app.use('/', getChannels);
app.use('/', getNewspapers);
app.use('/', getMagazines);
app.use('/', getRadios);
app.use('/', getCountries);
app.use('/', getStates);
app.use('/', getCities);
app.use('/', updateRadio);
app.use('/', getRadios);
app.use('/', updateLocation);
app.use('/', updateNewspapers);
app.use('/', updateMagazines);
app.use('/', addNewspaper);
app.use('/', addMagazine);
app.use('/', addRadio);
app.use('/', addEmailAlert);
app.use('/', streamVideo);
app.use('/', additionalcc);
app.use('/', generatePDF);
app.use('/', generateDocx);
app.use('/', generateHtml);
app.use('/', generateXlsx);
app.use('/', generateZip);
app.use('/', downloadMedia);
app.use('/', sendemail);
app.use('/', emailAlert);
app.use('/', newEmailAlert);
app.use('/', sendPage);
app.use('/', sendForm);
app.use('/', getCompanyName);
app.use('/', videoEditor);
app.use('/', guestSearchCount);
app.use('/', demoRequests);
app.use('/media-transfer',mediaTransfer);
require('./services/passport')(passport);
// This will initialize the passport object on every request
app.use(passport.initialize());

// catch 404 and forward to error handler

function NotFound() {
    this.name = "NotFound";
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

app.use(function (err, req, res, next) {
    if (err instanceof NotFound) {
        res.end('Page not found');
    } else {
        console.log(err);
        res.end(JSON.stringify({
            error: err,
            stack: err.stack
        }));
    }
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
