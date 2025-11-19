"use strict";
const db = require('./dbconnect.js');
const _ = require('underscore');

exports.getSimpleSearchResults = async function (searchQuery, selectedChannel, allChannels, numOfRecords, startDate, endDate, startTime, endTime) {
  //console.log("searchQuery-simpleSearchHandler.js: ", searchQuery, selectedChannel, allChannels, numOfRecords, startDate, endDate, startTime, endTime); //Debug
    console.log("searching " + searchQuery);
    
    // Store the search query terms for highlighting
    console.log("Original search query:", searchQuery);
    
    // Clean up the search query to extract meaningful terms
    let cleanedQuery = searchQuery
        .replace(/[+\/&"]/g, ' ') // Replace special search characters with spaces
        .replace(/\s+/g, ' ')     // Normalize whitespace
        .trim();
        
    // Handle possible quoted phrases
    let searchTerms = [];
    
    // Extract quoted phrases first
    const phraseMatches = cleanedQuery.match(/"([^"]+)"/g);
    if (phraseMatches) {
        phraseMatches.forEach(phrase => {
            // Add the phrase without quotes
            searchTerms.push(phrase.replace(/"/g, ''));
            // Remove the phrase from the query
            cleanedQuery = cleanedQuery.replace(phrase, ' ');
        });
    }
    
    // Now split the remaining text into individual terms
    const individualTerms = cleanedQuery
        .trim()
        .split(/\s+/)
        .filter(term => term.length > 2); // Only keep terms with 3+ characters
    
    // Combine phrase and individual terms
    searchTerms = searchTerms.concat(individualTerms);
    
    // Make sure we have at least one term
    if (searchTerms.length === 0 && cleanedQuery) {
        // If we filtered out everything but there was a query, add back the short terms
        searchTerms = cleanedQuery.trim().split(/\s+/);
    }
    
    console.log("Processed search terms for matching:", searchTerms);
    
    const query = 'CALL dc.Search_TV(?,?,?,?,?,?,?,?)';
    const queryParams = [searchQuery,
        selectedChannel,
        allChannels,
        numOfRecords,
        startDate,
        endDate,
        startTime,
        endTime];
    // console.log("abc");
    return queryDB(query, queryParams)
        .then(results => {
            // console.log("got results for " + searchQuery);
            return getDetails(results[0], searchTerms);
        })
        .catch(error => {
            console.log("error inside this 2");
            console.log(error);
            return getDetails([], searchTerms);
        });
};

/**
 * Returns only results that have a date before the given date.
 * @param {object} searchResults - the results to filter
 * @param {Date} date - the date to filter by
 */
exports.filterByDate = function (searchResults, date) {
    return searchResults.filter(result => {
        return result.Created_at > date;
    });
};

/**
 * Get details for the results of a search query
 * @param {*[]} rows - the results of the search query
 * @param {string[]} searchTerms - the search terms to match and highlight
 * @returns {Promise.<*[]>} a promise containing a list of all rows found
 */
function getDetails(rows, searchTerms = []) {
    // console.log(" in getDetails with ");
    // console.log(rows);
    const query = 'CALL dc.additional_cc(?,?,?,?)';
    const promises = [];
    const num_context_lines = 10; // Increased from 3
    
    for (const row of rows) {
        // Get more context lines before and after the match for better transcript display
        const params = [
            row.Mp4_File_Name,
            row.Channel_Id,
            row.CC_Num - 15, // Increased from 8 to get more prior context
            row.CC_Num + 15]; // Increased from 6 to get more after context
        const promise = queryDB(query, params)
            .then(results => {
                // Get the full transcript
                row.Result_Line = getDetail(results[0]);
                
                // Generate match snippet with 15 words of context starting from the match
                row.Match_Snippet = extractMatchContext(row.Result_Line, searchTerms);
                
                // Log each match for debugging
                console.log(`MATCH RESULT for ${row.Mp4_File_Name}:`);
                console.log(`- Original caption text: ${row.Original_Line || 'None'}`);
                console.log(`- Full transcript: ${row.Result_Line ? row.Result_Line.substring(0, 50) + '...' : 'None'}`);
                console.log(`- Match snippet: ${row.Match_Snippet}`);
                
                return row;
            })
            .catch(error => {
                console.log("Error fetching additional captions:", error);
                // Set a default Result_Line in case of error
                row.Result_Line = row.Result_Line || "Transcript unavailable";
                row.Match_Snippet = "No match context available";
                return row; // Make sure to return the row even if there's an error
            });
        promises.push(promise);
    }
    return Promise.all(promises);
}

/**
 * Combines all Result_Line properties from the results
 * @param {*[]} rows - rows from the query
 * @returns {string} the combined string
 */
/**
 * Extract a snippet of text starting from the match, including about 15 words of context
 * @param {string} text - The full text to search in
 * @param {string[]} searchTerms - Terms to find in the text
 * @returns {string} A snippet of text with the match highlighted
 */
function extractMatchContext(text, searchTerms) {
    console.log("EXTRACTING MATCH CONTEXT");
    console.log("Search terms:", searchTerms);
    console.log("Text length:", text ? text.length : 0);
    console.log("Text excerpt:", text ? text.substring(0, 50) + "..." : "No text");
    
    if (!text || text === "Transcript content unavailable." || !searchTerms || searchTerms.length === 0) {
        console.log("MATCH EXTRACTION FAILED: Invalid input");
        return "No match context available";
    }
    
    // Create a regex pattern from all search terms
    const pattern = new RegExp(`\\b(${searchTerms.join('|')})\\b`, 'i');
    console.log("Search pattern:", pattern);
    
    const match = text.match(pattern);
    
    if (!match) {
        console.log("MATCH EXTRACTION FAILED: No match found");
        // Try a more lenient search without word boundaries
        const lenientPattern = new RegExp(`(${searchTerms.join('|')})`, 'i');
        const lenientMatch = text.match(lenientPattern);
        
        if (lenientMatch) {
            console.log("Found match with lenient pattern:", lenientMatch[0]);
            // Continue with the lenient match
            const matchIndex = lenientMatch.index;
            const wordsAfterMatch = text.slice(matchIndex).split(/\s+/, 16);
            const snippet = wordsAfterMatch.join(' ');
            const highlightedSnippet = snippet.replace(lenientPattern, '**$1**');
            
            console.log("MATCH EXTRACTION SUCCEEDED (lenient):", highlightedSnippet);
            return highlightedSnippet;
        }
        
        return "Search terms not found in transcript excerpt";
    }
    
    // Find the starting position of the match
    const matchIndex = match.index;
    console.log("Match found at position:", matchIndex);
    console.log("Matched text:", match[0]);
    
    // Find the beginning of the snippet (start at the match)
    let startIndex = matchIndex;
    
    // Get approximately 15 words of context after the match
    const wordsAfterMatch = text.slice(matchIndex).split(/\s+/, 16); // Get 16 words including the match word
    
    // Create the snippet - just the match and following words
    const snippet = wordsAfterMatch.join(' ');
    
    // Highlight the matched term
    const highlightedSnippet = snippet.replace(pattern, '**$1**');
    
    console.log("MATCH EXTRACTION SUCCEEDED:", highlightedSnippet);
    return highlightedSnippet;
}

function getDetail(rows) {
    // Check if rows exists and has items
    if (!rows || !rows.length) {
        return ""; // Return empty string if no data available
    }
    
    // Filter out any null or undefined Result_Lines before processing
    const validRows = rows.filter(r => r && r.Result_Line);
    
    if (validRows.length === 0) {
        return "";
    }
    
    // Extract and clean up lines
    const lines = validRows.map(r => {
        // Clean up any special characters or odd formatting
        let line = r.Result_Line.trim()
            .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
            .replace(/[\r\n]+/g, ' '); // Replace newlines with spaces
        
        return line;
    });
    
    // Join all lines with a space, and ensure there's no leading/trailing whitespace
    const combinedText = lines.join(' ').trim();
    
    // Make sure we're returning something meaningful
    if (!combinedText || combinedText.length < 5) {
        return "Transcript content unavailable.";
    }
    
    return combinedText;
}


/**
 * Executes a mysql query and returns a promise containing rows.
 * @param {Pool} pool - the mysql pool to query with
 * @param {string} query - the SQL query
 * @param {Object} queryParams - the parameters for the SQL query
 * @return {Promise<*[]>} the rows
 */
function queryDB(query, queryParams) {
    return new Promise((resolve, reject) => {
try { 
var pool = db.getPool(); 
pool.getConnection(function(err, connection) {
 // Use the connection
 if (err) {
 console.log("err 1");
 console.log(err);
 console.log("err 2");
 reject(err);
 }
 else {
 var q = {sql: query, timeout: 400000};
 connection.query(q, queryParams, (err, rows) => {
if (err) {
console.log("err 3");
console.log(err);
console.log("err 4");
connection.release();
reject(err);
} else {
console.log("success");
connection.release();
resolve(rows);
}
 });
 }
});
}
catch (err) {
console.log("err 5");
console.log(err);
console.log("err 6");
reject(err);
}
        
    })
}