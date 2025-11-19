/*

2017-11-15: TODO: Can we delete this? What else can we delete? -Charlette

CURRENTLY INCOMPLETE
The purpose of this script is to send an email to DigiClips through the Gmail API.

Refer to Gmail's documentation for setting up an API and key for a Gmail account:
https://developers.google.com/gmail/api/auth/web-server

Steps to complete:
 - Get email functionality working
 - Allow script to accept input from frontend
 - Hook frontend (dc_frontend_boot/digiclips/app/views/order.html) to form
*/

var express = require('express');
var db = require('./dbconnect.js');
var crypto = require('crypto');
var moment = require('moment');
var router = express.Router();
var _ = require('underscore');
var querystring = require("querystring");
var CLIENT_ID = '';
var SCOPES = ['https://mail.google.com/', 'https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/gmail.labels'];
const passport = require('passport');



router.get('/email', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    /////////SEND THE EMAIL HERE///////

    res.status(200).send("\n\nEmail successfully sent.\n\n");
});

/*
function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    loadGmailApi();
  }
}

$scope.initializeGMailInterface = function() {
  gapi.auth.authorize({
    client_id: CLIENT_ID,
    scope: SCOPES,
    immediate: true
  }, handleAuthResult);
};

function loadGmailApi() {
  gapi.client.load('gmail', 'v1', function() {
    console.log("Loaded GMail API");
  });
}

$scope.sendEmail = function() {
  var content     = 'HELLO';
  var sender      = 'digiclipsinc@gmail.com';
  var receiver    = 'kevinpayravi@gmail.com';
  var to          = 'To: '   + receiver;
  var from        = 'From: ' + sender;
  var subject     = 'Subject: ' + 'HELLO TEST';
  var contentType = 'Content-Type: text/plain; charset=utf-8';
  var mime        = 'MIME-Version: 1.0';

  var message = "";
  message +=   to           + "\r\n";
  message +=   from         + "\r\n";
  message +=   subject      + "\r\n";
  message +=   contentType  + "\r\n";
  message +=   mime         + "\r\n";
  message +=  "\r\n"        + content;

  sendMessage(message, receiver, sender);
};

function sendMessage(message, receiver, sender) {
  var headers = getClientRequestHeaders();
  var path = "gmail/v1/users/me/messages/send?key=" + CLIENT_ID;
  var base64EncodedEmail = btoa(message).replace(/\+/g, '-').replace(/\//g, '_');

  gapi.client.request({
    path: path,
    method: "POST",
    headers: headers,
    body: {
      'raw': base64EncodedEmail
    }
  }).then(function (response) {

  });
}

var t = null;
function getClientRequestHeaders() {
  if(!t) t = gapi.auth.getToken();
  gapi.auth.setToken({token: t['access_token']});
  var a = "Bearer " + t["access_token"];
  return {
    "Authorization": a,
    "X-JavaScript-User-Agent": "Google APIs Explorer"
  };
}
*/
module.exports = router;
