"use strict";
var pdf = require('html-pdf');

exports.generatePDF = function(htmlString) {
  return new Promise((resolve, reject) => {
  pdf.create(htmlString).toBuffer((err, pdfbuffer) => {
      if (err) {
        // handle error and return a error response code
        console.log('Broke it')

        reject(err)
      } else {
        resolve(pdfbuffer)
      }
    });
  })
};
