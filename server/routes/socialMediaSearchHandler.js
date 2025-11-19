const rp = require('request-promise');
const Twitter = require('twitter-node-client').Twitter;

/**
 * Removes unneeded sections of Twitter attribute 'created_at'.
 *
 * @param {string}  dateTime    Date/time from Twitter attribute 'created_at'.
 *
 * @return {string} Trimmed date/time.    
 */
var trimTwitterDateTime = (dateTime) => {
    var dateTimeArray = dateTime.split(" ");
    return dateTimeArray[1] + ' ' + dateTimeArray[2] + ' ' + dateTimeArray[3] + ' ' + dateTimeArray[5];
}

/**
 * Checks if date is within start and end date.
 *
 * @param {Date}    date        Date/time to validate.
 * @param {Date}    startDate   Start date/time.
 * @param {Date}    endDate     End date/time.
 *
 * @return {boolean} True if date is within startDate and endDate, or startDate and endDate are not specified. 
 *                   False if date is outside startDate or endDate.                 
 */
var isValidDate = (date, startDate, endDate) => {
    if (startDate != "Invalid Date") {
        if (endDate != "Invalid Date") {
            return date >= startDate && date <= endDate;
        }
        return date >= startDate;
    } 
    if (endDate != "Invalid Date") {
        return date <= endDate;
    }
    return true;
}

/**
 * Retrieves social media search results.
 *
 * @param {string}  searchQuery             Search keywords.       
 * @param {number}  numOfRecords            Number of results.
 * @param {string}  [startDateTime]         Start date/time.
 * @param {string}  [endDateTime]           End date/time.
 * @param {string}  [selectedSocialMedia]   Social media source.
 *
 * @return {object} Request promise containing search results or error message.
 */
exports.getSearchResults = (searchQuery, numOfRecords, startDateTime, endDateTime, selectedSocialMedia) => {
    return new Promise((resolve, reject) => {
        let optionsSearch = {
            url: 'https://www.googleapis.com/youtube/v3/search',
            json: true,
            qs: {
                key: 'AIzaSyAOacuSUCl0i6v05UMtp9r9fRtnwsVw2b4',
                q: searchQuery,
                part: 'snippet',
                order: 'viewCount',
                relevanceLanguage: 'en',
                searchParams: 3
            }
        };

        // Setup request parameters
        var twitterParams = {'q': searchQuery, 'result_type': 'popular'};

        if (numOfRecords != null && numOfRecords > 0) {
            optionsSearch.qs.maxResults = 0;
            twitterParams['count'] = numOfRecords;
        }

        var startDate = new Date(startDateTime);
        if (startDate.toString() != "Invalid Date") {
            // Youtube 'publishedAfter' format: YYYY-MM-DDTHH:mm:ss.ms
            optionsSearch.qs.publishedAfter = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' 
                + startDate.getDate() + 'T' + startDate.getHours() + ':' + startDate.getMinutes() + ':'
                + startDate.getSeconds() + '.' + startDate.getMilliseconds() + 'Z';
        }

        var endDate = new Date(endDateTime);
        if (endDate.toString() != "Invalid Date") {
            // Youtube 'publishedBefore' format: YYYY-MM-DDTHH:mm:ss.ms
            optionsSearch.qs.publishedBefore = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' 
                + endDate.getDate() + 'T' + endDate.getHours() + ':' + endDate.getMinutes() + ':'
                + endDate.getSeconds() + '.' + endDate.getMilliseconds() + 'Z';

            // Twitter 'until' format: YYYY-MM-DD
            twitterParams['until'] = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate();
        }

        console.log(optionsSearch);

        rp(optionsSearch)
            .then((bodySearch) => {
                const videoString = bodySearch.items.map((item) => {
                    switch (item.id.kind) {
                        case 'youtube#channel':
                            return item.id.channelId;
                            break;
                        case 'youtube#playlist':
                            return item.id.playlistId;
                            break;
                        default:
                            return item.id.videoId;
                            break;
                    }
                }).join(',');

                let optionsVideos = {
                    url: 'https://www.googleapis.com/youtube/v3/videos',
                    json: true,
                    qs: {
                        key: 'AIzaSyAOacuSUCl0i6v05UMtp9r9fRtnwsVw2b4',
                        part: 'snippet,statistics',
                        id: videoString
                    }
                };

                // ---------- Youtube results ---------- //
                rp(optionsVideos)
                    .then((bodyVideos) => {
                        const videos = bodyVideos.items.map((item) => {
                            return {
                                "id": item.id,
                                "source": "youtube",
                                "author": item.snippet.channelTitle,
                                "date": item.snippet.publishedAt,
                                "text": item.snippet.title,
                                // "text": item.snippet.description,
                                "image": item.snippet.thumbnails.default.url,
                                "url": 'https://www.youtube.com/watch?v=' + item.id,
                                "attributes": {
                                    "views": item.statistics.viewCount,
                                    "likes": item.statistics.likeCount,
                                    "dislikes": item.statistics.dislikeCount
                                }
                            }
                        })
                        
                        // ---------- Twitter results ---------- //
                        // Twitter API authentification
                        var config = {
                            "consumerKey": "WUceojTd4vcntl2NI4z7M9D1y",
                            "consumerSecret": "8rsP1qH6ee1lmCwBM4qQc0LRT5rhbByvFOBipXWbqrm31vLC6C",
                            "accessToken": "971506844253466631-7ueORAj2HF7A3rsGnEbpAUltc9zXf3D",
                            "accessTokenSecret": "UH2NeGhKBDRQCDeg13vdDB0Cx7YD6llkNXR6UgxgmUHUg"
                        }
                        var twitter = new Twitter(config);

                        // Error callback function for Twitter search
                        var error = (err, response, body) => {
                            console.log(body);
                            reject("Unable to get Twitter search results.");
                        };

                        // Success callback function for Twitter search
                        var success = (body) => {
                            var bodyTweets = JSON.parse(body);
                            const tweets = bodyTweets.statuses.map((status) => {
                                return {
                                    "id": status.id,
                                    "source": "twitter",
                                    "author": status.user.name,
                                    "date": trimTwitterDateTime(status.created_at),
                                    "text": status.text,
                                    "image": status.user.profile_image_url,
                                    "url": "https://twitter.com/web/status/" + status.id_str,
                                    "attributes": {
                                        "hashtags": status.entities.hashtags,
                                        "retweets": status.retweet_count,
                                        "favorites": status.favorite_count
                                    }
                                }
                            })
                            
                            // Retrieve equal number of results from each source if possible
                            let finalResults = [];
                            let index = 0;
                            while (finalResults.length < numOfRecords && index < numOfRecords) {
                                if ((selectedSocialMedia == undefined || selectedSocialMedia == "All" || selectedSocialMedia == "youtube") &&
                                    finalResults.length < numOfRecords && index < videos.length) {

                                    if (isValidDate(new Date(videos[index].date), startDate, endDate)) {   
                                        finalResults.push(videos[index]);
                                    }
                                }

                                if ((selectedSocialMedia == undefined || selectedSocialMedia == "All" || selectedSocialMedia == "twitter") &&
                                    finalResults.length < numOfRecords && index < tweets.length) {

                                    if (isValidDate(new Date(tweets[index].date), startDate, endDate)) {   
                                        finalResults.push(tweets[index]);
                                    }
                                }
                                index++;
                            }

                            // Sort results by source
                            finalResults.sort((a, b) => { 
                                if (a.source < b.source)
                                    return -1;
                                if (a.source > b.source)
                                    return 1;
                                return 0;
                            });

                            resolve({ socialMediaResults: JSON.stringify(finalResults) });
                        };
			console.log(twitterParams);
                        twitter.getSearch(twitterParams, error, success);
                    })
                    .catch((err) => {
                        console.log(err);
                        reject("Sorry! Something broke in social media!\n" + err);
                    })
            })
            .catch((err) => {
                console.log(err);
                reject("Sorry! Something broke in social media!\n" + err);
            })

    })
}

