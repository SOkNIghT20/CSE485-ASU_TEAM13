"use strict";
const fileNameService = require('../services/fileNameService');
const htmlService = require('../services/htmlService');
var express = require('express');
var router = express.Router();
var fs = require("fs");
var JSZip = require("jszip");
var docx = require('./generateDocxHandler');
var pdf = require('./generatePDFHandler');
const excelService = require('../services/excelService');
const passport = require('passport');

var zip = new JSZip();

router.get('/all', (req, res) => {
  const searchQuery = req.query.searchQuery;
  const media = req.query.mediaType;
  const selectedChannel = req.query.selectedChannel;
  const selectedNewspaper = req.query.selectedNewspaper;
  const selectedMagazine = req.query.selectedMagazine;
  const selectedSocialMedia = req.query.selectedSocialMedia;
  const selectedRadio = req.query.selectedRadio;
  const country = req.query.country;
  const stateProvince = req.query.stateProvince;
  const city = req.query.city;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const startDateTime = req.query.startDateTime;
  const endDateTime = req.query.endDateTime;
  const startTime = req.query.startTime;
  const endTime = req.query.endTime;
  const numOfRecords = req.query.numOfRecords;
  const allChannels = selectedChannel === 'All';
  const allPapers = selectedNewspaper === 'All';
  const allMags = selectedMagazine === 'All';
  const allCountries = country === 'All';
  const allStates = stateProvince === 'All';
  const allCities = city === 'All';
  const newsIds = JSON.parse(req.query.newspaperResults);
  const magIds = JSON.parse(req.query.magazineResults);
  const socialMediaIds = JSON.parse(req.query.socialMediaResults);
  const radioIds = JSON.parse(req.query.radioResults);
  const televisionIds = JSON.parse(req.query.televisionResults);
  var fileName;
  switch (media) {
    case "Newspaper": {
      fileName = fileNameService.generateFileNameNews(searchQuery);
      break;
    }
    case "Magazine": {
      fileName = fileNameService.generateFileNameMagazine(searchQuery);
      break;
    }
    case "Television": {
      fileName = fileNameService.generateFileName(searchQuery, selectedChannel);
      break;
    }
    case "Social Media": {
      fileName = fileNameService.generateFileNameSocialMedia(searchQuery);
      break;
    }
    case "Radio": {
      fileName = fileNameService.generateFileNameRadio(searchQuery);
      break;
    }
    default: {
      fileName = fileNameService.generateFileNameAll(searchQuery);
      break;
    }
  }



  htmlService.generateHtml(searchQuery, media, selectedChannel, selectedNewspaper, selectedMagazine, selectedSocialMedia, country,
                                  stateProvince, city, startDateTime, endDateTime, startDate, endDate,startTime, endTime, numOfRecords, allChannels, allPapers,
                                  allMags, allCountries, allStates, allCities, newsIds, magIds, socialMediaIds, selectedRadio, radioIds, televisionIds)
    .then(htmlString => {
      zip.file('HtmlReport.html', htmlString);
      docx.generateDocx(htmlString).then(docxBuff => {
        zip.file('DocxReport.docx', docxBuff);
        pdf.generatePDF(htmlString).then(pdfBuff => {
          zip.file('PdfReport.pdf', pdfBuff);
          excelService.generateXlsx(searchQuery, media, selectedChannel, selectedNewspaper, selectedMagazine, selectedSocialMedia, country,
                                    stateProvince, city, startDateTime, endDateTime, startDate, endDate, startTime, endTime, numOfRecords, allChannels, allPapers,
                                    allMags, allCountries, allStates, allCities, newsIds, magIds, socialMediaIds, selectedRadio, radioIds, televisionIds)
            .then(worksheet => {
              zip.file('ExcelReport.xlsx', worksheet);
              zip.generateAsync({type: 'nodebuffer'}).then(zipReport => {
                res.setHeader('Content-Disposition', 'attachment; filename=reports.zip');
                res.send(zipReport);
              },
              err => {
                console.log(err);
                res.status(500).send("Something broke!");
              });
            },
            err => {
              console.log(err);
              res.status(500).send("Something broke!");
            });
        },
        err => {
          console.log(err);
          res.status(500).send("Something broke!");
        });
      },
      err => {
        console.log(err);
        res.status(500).send("Something broke!");
      });
    },
    err => {
      console.log(err);
      res.status(500).send("Something broke!");
    });
});

//used for selecting what formats they want (eg. just .pdf and .html)
router.get('/zip', async (req, res) => {
  const fileTypes = JSON.parse(req.query.fileTypes);
  const searchQuery = req.query.searchQuery;
  const media = req.query.mediaType;
  const selectedChannel = req.query.selectedChannel;
  const selectedNewspaper = req.query.selectedNewspaper;
  const selectedMagazine = req.query.selectedMagazine;
  const selectedSocialMedia = req.query.selectedSocialMedia;
  const selectedRadio = req.query.selectedRadio;
  const country = req.query.country;
  const stateProvince = req.query.stateProvince;
  const city = req.query.city;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const startDateTime = req.query.startDateTime;
  const endDateTime = req.query.endDateTime;
  const startTime = req.query.startTime;
  const endTime = req.query.endTime;
  const numOfRecords = req.query.numOfRecords;
  const allChannels = selectedChannel === 'All';
  const allPapers = selectedNewspaper === 'All';
  const allMags = selectedMagazine === 'All';
  const allCountries = country === 'All';
  const allStates = stateProvince === 'All';
  const allCities = city === 'All';
  const newsIds = JSON.parse(req.query.newspaperResults);
  const magIds = JSON.parse(req.query.magazineResults);
  const socialMediaIds = JSON.parse(req.query.socialMediaResults);
  const radioIds = JSON.parse(req.query.radioResults);
  const televisionIds = JSON.parse(req.query.televisionResults);

  const functionRouter = {
    "html": {
      evoke: ((htmlString) => {return Promise.resolve(htmlString)}), //simply return the htmlString
      fileName: "HtmlReport.html",
    },
    "pdf": {
      evoke: pdf.generatePDF,
      fileName: "PdfReport.pdf",
    },
    "docx": {
      evoke: docx.generateDocx,
      fileName: "DocxReport.docx",
    },
  }

  //switch statement currently not used. Should be implemented to update fileNames for each particular format type
  var fileName;
  switch (media) {
    case "Newspaper": {
      fileName = fileNameService.generateFileNameNews(searchQuery);
      break;
    }
    case "Magazine": {
      fileName = fileNameService.generateFileNameMagazine(searchQuery);
      break;
    }
    case "Television": {
      fileName = fileNameService.generateFileName(searchQuery, selectedChannel);
      break;
    }
    case "Social Media": {
      fileName = fileNameService.generateFileNameSocialMedia(searchQuery);
      break;
    }
    case "Radio": {
      fileName = fileNameService.generateFileNameRadio(searchQuery);
      break;
    }
    default: {
      fileName = fileNameService.generateFileNameAll(searchQuery);
      break;
    }
  }

  //base string for all file types except .xlsx
  let htmlString = await htmlService.generateHtml(searchQuery, media, selectedChannel, selectedNewspaper, selectedMagazine, selectedSocialMedia, country,
    stateProvince, city, startDateTime, endDateTime, startDate, endDate,startTime, endTime, numOfRecords, allChannels, allPapers,
    allMags, allCountries, allStates, allCities, newsIds, magIds, socialMediaIds, selectedRadio, radioIds, televisionIds);


  //go through each filetype
  //note, this could be transformed to use Promise.all() to run the file creation all at once
  for(let fileType of fileTypes){
    try {
      //if is xlsx, we have to do it differently
      if(fileType === "xlsx"){
        let excelString = await excelService.generateXlsx(searchQuery, media, selectedChannel, selectedNewspaper, selectedMagazine, selectedSocialMedia, country,
        stateProvince, city, startDateTime, endDateTime, startDate, endDate, startTime, endTime, numOfRecords, allChannels, allPapers,
        allMags, allCountries, allStates, allCities, newsIds, magIds, socialMediaIds, selectedRadio, radioIds, televisionIds);
        zip.file("XLSXReport.xlsx", excelString);
        continue;
      }

      //call the appropiate function for the specific file type, and get the buffer string back
      let buffer = await functionRouter[fileType].evoke(htmlString);
      //zip that file
      zip.file(functionRouter[fileType].fileName, buffer);
    }catch (e){
      console.log(buffer);
      res.status(500).send("Something broke!");
      return;
    }
    
  }

  let response = zip.generateAsync({type: 'nodebuffer'}).then(zipReport => {
    res.setHeader('Content-Disposition', 'attachment; filename=reports.zip');
    res.send(zipReport);
  });

  if (!response.ok) {
    console.log(buffer);
    res.status(500).send("Something broke!");
    return;
  }

});



module.exports = router;
