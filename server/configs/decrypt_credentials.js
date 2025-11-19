module.exports = getConnectionInfo

function getConnectionInfo(){
    const crypto = require('crypto');
    const fs = require('fs');
    
    // Same encryption algorithm
    const algorithm = 'aes-256-cbc';
    
    // Get encrpyted json
    var encrypted_json = JSON.parse(fs.readFileSync(__dirname + '/./encrypted_credentials.json', 'utf8'));
    
    key = Buffer.from(encrypted_json["k"], 'hex')
    iv = Buffer.from(encrypted_json["v"], 'hex')
    
    // Decrypt the credentials
    function decryptCredentials(item) {
        let encrypted= Buffer.from(item, 'hex');
        let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
        let decrypted = decipher.update(encrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
    
    db_info = {}
    db_info["host"] = decryptCredentials(encrypted_json["host"]);
    db_info["port"] = Number(decryptCredentials(encrypted_json["port"]));
    db_info["user"] = decryptCredentials(encrypted_json["user"]);
    db_info["password"] = decryptCredentials(encrypted_json["password"]);

    return db_info;

};

