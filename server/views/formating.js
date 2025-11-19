"use strict";
/**
 * Formats the publish date to 'MMMM d, y h:mm a' format.
 * @param {string} date - the publish date of an article
 */
exports.formatDate = function (date) {
  if (date === null) {
    return date;
  } else {
    var convertedDate = new Date(date);

    var day = convertedDate.getDate();
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    var monthIndex = convertedDate.getMonth();
    var month = monthNames[monthIndex];
    var year = convertedDate.getFullYear();

    var hours = convertedDate.getHours();
    var minutes = convertedDate.getMinutes();
    var timeOfDay = "AM";
    if (hours >= 12) {
      timeOfDay = "PM";
      hours = hours - 12;
    }
    if (hours === 0) {
      hours = 12;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    return month + " " + day + ", " + year + " " + hours + ":" + minutes + " " + timeOfDay;
  }
};

/**
 * Formats the author to proper case.
 * @param {string} author - the author of an article
 */
exports.formatAuthor = function (author) {
  if (author === null) {
    return author;
  } else {
    var str = author.toLowerCase();
    return str.split(/\s+/).map(str => str[0].toUpperCase() + str.slice(1)).join(' ');
  }
};


/**
 * Formats apostrophes into format needed
 * @param {string} text - the text to format
 * @returns {string} the formatted text including the '.
 */
exports.formatApostrophes = function(text) {
  if (text === null){
    return text
  } else {
    return text.replace(/&apos;|’|&#8217;/gi, "'");
  }
}
