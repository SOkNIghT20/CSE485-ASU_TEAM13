const request = require ("request");
const FeedParser = require ("feedparser");
const Insert = require('./../routes/newspaperResultHandler');
const Feeds = require('./../routes/getNewspaperFeedsHandler');
const Cleanup = require('./../routes/newspaperCleanupHandler');
const Alerts = require('./../routes/emailAlertListHandler');
const AlertArticleInserter = require('../routes/articleAlertHandler');

module.exports = {
  runParser: function(DAYS_FOR_CLEANUP){
    console.log("Starting newspaper parser");
    Cleanup.cleanupNewspaperTable(DAYS_FOR_CLEANUP);

    Feeds.getFeeds().then(rows =>{
        var i;
        for(i = 0; i < rows[0].length; i++){
          var newspaperName = rows[0][i].NewspaperName;
          var newspaperLink = rows[0][i].NewspaperLink;
          var url = rows[0][i].URL;
          processFeed(url, newspaperName, newspaperLink);
        }
      }
    ).catch(err => {
      console.log("Couldn't start newspaper parse");
      console.error(err);
    });
  }
};

// Gets the feed from a given URL
function getFeed (urlfeed, callback) {
  var req = request (urlfeed);
  var feedparser = new FeedParser ();
  var feedItems = new Array ();
  req.on ("response", function (response) {
    var stream = this;
    if (response.statusCode == 200) {
      stream.pipe (feedparser);
    }
  });
  req.on ("error", function (err) {
    console.log ("getFeed: err.message == " + err.message);
  });
  feedparser.on ("readable", function () {
    try {
      var item = this.read ();
      if (item !== null) { //2/9/17 by DW
        feedItems.push (item);
      }
    }
    catch (err) {
      console.log ("getFeed: err.message == " + err.message);
    }
  });
  feedparser.on ("end", function () {
    callback (undefined, feedItems);
  });
  feedparser.on ("error", function (err) {
    console.log ("getFeed: err.message == " + err.message);
    callback (err);
  });
}

function processFeed(url, newspaperName, newspaperLink) {
  getFeed(url, function (err, feedItems) {
      if (!err) {
        for (var i = 0; i < feedItems.length; i++) {

          var articleData = [
            feedItems [i].title,
            feedItems [i].link,
            feedItems [i].pubdate,
            feedItems [i].date,
            authorTruncate(feedItems [i].author),
            feedItems [i].image.title,
            feedItems [i].image.url,
            categoryIfNotNull(feedItems [i].categories),
            feedItems [i].guid,
            descriptionIfNotNull(feedItems [i].description),
            newspaperName,
            newspaperLink
          ];
          
          Insert.insertIntoDatabase(articleData).then(results => {
            // If the promise returns something that means the insert was successful so the article is new
            // That means check to see if it matches any email alerts
            Alerts.getAlertList().then(rows => {
              var i;
              for(i = 0; i < rows[0].length; i++) {
                var mediaType = rows[0][i].MediaType;

                if (mediaType == "Newspaper" || mediaType == "All"){
                  var alertID = rows[0][i].AlertID;
                  var keywords = rows[0][i].Keywords;

                  if (feedItems [i].title.toLowerCase().indexOf(keywords.toLowerCase())){
                    AlertArticleInserter.insertIntoDatabase([alertID, "NewspaperResults", feedItems [i].guid]);
                  }else if(feedItems [i].categories.toString().toLowerCase().indexOf(keywords.toLowerCase())){
                    AlertArticleInserter.insertIntoDatabase([alertID, "NewspaperResults", feedItems [i].guid]);
                  }else if(feedItems [i].description.toLowerCase().indexOf(keywords.toLowerCase())){
                    AlertArticleInserter.insertIntoDatabase([alertID, "NewspaperResults", feedItems [i].guid]);
                  }
                }

              }
            }).catch((err)=>{
              console.log(err);
            });
          }).catch(err => {
            // don't do anything
          })
        }
      }
    }
  );
}

function categoryIfNotNull(category){
  if (category == null){
    return null;
  }
  return category.toString();
}

function descriptionIfNotNull(description){
  if (description == null){
    return null;
  }
  description = description.replace(/<(?:.|\n)*?>/gm, ' ');

  if (description.length > 400) return description.substring(0,396) + "...";
  return description;
}

function authorTruncate(author){
  if (author != null && author.length > 100) return author.substring(0,96) + "...";
  return author;
}
