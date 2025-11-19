//import { utils, write, WorkBook } from "xlsx";
const xlsx = require('xlsx');

/**
  Class for creating a xlsx file based off of the results on the arrange results page
*/
exports.generateXlsxWorkbook = function (magazineResults, newspaperResults, radioResults, socialMediaResults, tvResults){
  /**
    Function to create and populate the xlsx
    @param magazineResults - The Magazine results from the search
    @param newspaperResults - The Newspaper results from the search
    @param radioResults - The Radio results from the search
    @param socialMediaResults - The Social Media results from the search
    @param tvResults - The TV results from the search

    @returns The populated xlsx file
  */
    // Setup the Sheet
    var wb = xlsx.utils.book_new(); // The workbook to edit
    wb.Props = {
      Title: "Search Results",
      Subject: "The xlsx sheet containing all the results from the query",
      Author: "DigiClips",
      CreatedDate: new Date()
    };
    wb.SheetNames.push("Search Results");

    // Populate the Sheet
    var ws_data = [['Date', 'Media Type', 'Location', 'Title', 'Author', 'Text']];

    // Add Newspaper
    for (let newspaper in newspaperResults){
      let currentNewspaper = newspaperResults[newspaper];
      var newsData = [new Date(currentNewspaper.PublishDate),
                       'Newspaper',
                       currentNewspaper.Newspaper,
                       exports.boldFoundWords(currentNewspaper.Title),
                       currentNewspaper.Author,
                       exports.boldFoundWords(currentNewspaper.Summary)
                     ];

      ws_data.push(newsData);
    }


    // Add Magazine
    for (let magazine in magazineResults){
      let currentMagazine = magazineResults[magazine];
      var magData = [new Date(currentMagazine.PublishDate),
                      'Magazine',
                      currentMagazine.Magazine,
                      exports.boldFoundWords(currentMagazine.Title),
                      currentMagazine.Author,
                      exports.boldFoundWords(currentMagazine.Summary)
                    ];

      ws_data.push(magData);
    }


    // Add Radio
    for (let radio in radioResults){
      let currentRadio = radioResults[radio];
      var radData = [new Date(currentRadio.TStamp.substring(0,10)),
                      'Radio',
                      exports.boldFoundWords(currentRadio.FName),
                      '',
                      currentRadio.SName,
                      exports.boldFoundWords(currentRadio.TEXTS)
                    ];

      ws_data.push(radData);
    }

    // Add TV
    for (let tv in tvResults){
       let currentResult = tvResults[tv];
       var tvData = [new Date(currentResult.Created_at),
                    'TV',
                    currentResult.Mp4_File_Name,
                    '',
                    currentResult.Channel_Name,
                    exports.boldFoundWords(currentResult.Result_Line)
                  ];
        ws_data.push(tvData);

     }

    // Convert the sheet
    var ws = xlsx.utils.aoa_to_sheet(ws_data);
    wb.Sheets["Search Results"] = ws;

    // Export the Results as binary
    var wbout = xlsx.write(wb, {bookType:'xlsx', type: 'binary'});
    var arrayBuf = exports.s2ab(wbout);
    var buf = exports.ab2b(arrayBuf);

    return buf;
  }

  // Convert xlsx for download
  exports.s2ab = function(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  exports.ab2b = function(ab){
    var buf = Buffer.alloc(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
  }

  /**
    Method to remove the tags from bold found words.

    @param wordString The string to fix

    @returns The string with bold tags replaced
  */
  exports.boldFoundWords = function(wordString) {
    if(wordString == null) { return wordString } // To acount for the title/summary being blank
    let wordLength = wordString.length;
    let startingIndex = 0;
    let closingIndex = wordString.indexOf("<span");
    let noBold = true;

    let beforeBold = ""; //beforeBold
    let inBold = ""; //inBold
    let afterBold; //afterBold
    let fullTitle = ""; //beforeBold

    // If a bold word is found, remove it
    while (closingIndex != null && startingIndex != null &&
            startingIndex < wordLength && closingIndex < wordLength &&
            closingIndex != -1){
      noBold = false;

      // Anything before the tag
      beforeBold = wordString.substring(startingIndex, closingIndex)

      // Anything in the tag
      startingIndex = closingIndex + 35;
      closingIndex = wordString.indexOf("</span>", startingIndex);
      inBold = wordString.substring(startingIndex, closingIndex);

      // Build the new string
      fullTitle = fullTitle + beforeBold + inBold

      // See if there's any other bold words
      startingIndex = closingIndex + 7;
      closingIndex = wordString.indexOf("<span", startingIndex);
    }

    // If no bold words found, the original string is used
    if (noBold){
      fullTitle = wordString;
    }

    return fullTitle;
  }
