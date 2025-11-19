const crypto = require('crypto');
var fs = require('fs');

// Get the credentials file
var credentials = JSON.parse(fs.readFileSync(__dirname + '/./credentials.txt', 'utf8'));

// Set the algorithm
const algorithm = 'aes-256-cbc';

// Generate key & iv
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);



function encryptCredentials(item) {
 // create cypher
 let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
 // get encrpytion
 let encrypted = Buffer.concat([cipher.update(item), cipher.final()]);
 return encrypted.toString('hex');
}

// Encrypt all items
for (item in credentials){
    credentials[item] = encryptCredentials(credentials[item])
}

// Set for future reference
credentials["k"] = key
credentials["v"] = iv

// Write to file
var string_json = JSON.stringify(credentials);

fs.writeFile("./encrypted_credentials.json", string_json, function (err) {
    if (err) {
        console.log("Could not encrypt file");
        return console.log(err);
    }
    console.log("File encrypted and saved as encrypted_credentials.json");
});
