// var htmlDocx = require('html-to-docx');

// exports.generateDocx = async function(htmlString) {
//     const buff = await htmlDocx(htmlString, null, {
//         table: { row: { cantSplit: true } },
//         footer: false,
//         pageNumber: true,
//       });
//     return buff;
// };

var htmlDocx = require('html-docx-js');

exports.generateDocx = function(htmlString) {
    return new Promise((resolve, reject) => {
        var html_to_docx = htmlDocx.asBlob('<!DOCTYPE html>'+ htmlString + "</html>");
        return resolve(html_to_docx)
    })
};

// var pandoc = require('node-pandoc');

// exports.generateDocx = function(htmlString) {
//     return new Promise((resolve, reject) => {
//         var args = '-f html -t pptx -o ./DocxReport.pptx';

//         // Set your callback function
//         callback = function (err, result) {
//             if (err) console.error('Oh Nos: ',err);
//             // Without the -o arg, the converted value will be returned.
//             return console.log(result), result;
//         };

//         pandoc(htmlString, args, callback);

//         return resolve(null);
//     })
// };