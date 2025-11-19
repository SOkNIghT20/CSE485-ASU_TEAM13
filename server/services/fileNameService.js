"use strict";
const format = require('../views/formating');

/**
 * Generates a filename with the current date, given query and given channel
 * @param {string} searchQuery - the keywords and phrases of the search
 * @param {string} selectedChannel - the channels covered by the search
 * @returns {string} the constructed filename
 */
exports.generateFileName = function(searchQuery, selectedChannel) {
    var fileName = "";
    var date = Date().split(" ");
    fileName += date[1] + " " + date[2] + " " + date[3];
    var time = date[4].split(":");
    fileName += " at time " + time[0] + " " + time[1] + ' ' + date[5];
    fileName += " search for \'" + searchQuery.replace(/\+\"/g, '').replace(/\"/g, '') + "\' ";
    if (selectedChannel === "All") {
      fileName += "on all channels";
    } else {
      fileName += "on channel " + selectedChannel;
    }
    return fileName;
};

/**
 * Generates a filename with the given query and current date.
 * @param {string} searchQuery - the keywords and phrases of the search
 * @returns {string} the constructed filename
 */
exports.generateFileNameNews = function(searchQuery) {
    var fileName = "Newspaper search on ";
    fileName += "\'" + searchQuery.replace(/\+\"/g, '').replace(/\"/g, '') + "\' ";
    var date = new Date();
    fileName += format.formatDate(date.toISOString()).replace(/,/g, '');
    return fileName;
};

/**
 * Generates a filename with the given query and current date.
 * @param {string} searchQuery - the keywords and phrases of the search
 * @returns {string} the constructed filename
 */
exports.generateFileNameRadio = function(searchQuery) {
  var fileName = "Radio search on ";
  fileName += "\'" + searchQuery.replace(/\+\"/g, '').replace(/\"/g, '') + "\' ";
  var date = new Date();
  fileName += format.formatDate(date.toISOString()).replace(/,/g, '');
  return fileName;
};

/**
 * Generates a filename with the given query and current date.
 * @param {string} searchQuery - the keywords and phrases of the search
 * @returns {string} the constructed filename
 */
exports.generateFileNameMagazine = function(searchQuery) {
  var fileName = "Magazine search on ";
  fileName += "\'" + searchQuery.replace(/\+\"/g, '').replace(/\"/g, '') + "\' ";
  var date = new Date();
  fileName += format.formatDate(date.toISOString()).replace(/,/g, '');
  return fileName;
};

/**
 * Generates a filename with the current date, given query and given newspaper
 * @param {string} searchQuery - the keywords and phrases of the search
 * @returns {string} the constructed filename
 */
exports.generateFileNameSocialMedia = function(searchQuery) {
    var fileName = "Social Media Search on ";
    fileName += "\'" + searchQuery.replace(/\+\"/g, '').replace(/\"/g, '') + "\' ";
    var date = new Date();
    fileName += format.formatDate(date.toISOString()).replace(/,/g, '');
    return fileName;
};

/**
 * Generates a filename with the current date, given query and given channel, and newspaper
 * @param {string} searchQuery - the keywords and phrases of the search
 * @returns {string} the constructed filename
 */
exports.generateFileNameAll = function(searchQuery) {
  var fileName = "All media search on ";
  fileName += "\'" + searchQuery.replace(/\+\"/g, '').replace(/\"/g, '') + "\' ";
  var date = new Date();
  fileName += format.formatDate(date.toISOString()).replace(/,/g, '');
  return fileName;
};
