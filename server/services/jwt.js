const jsonwebtoken = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const PRIV_KEY = fs.readFileSync(path.join(__dirname, '../jwt_keys/id_rsa_priv.pem'), 'utf8');

module.exports.issueJWT = issueJWT;

function issueJWT(user) {
  const expiresIn = '1 d';
  
  const payload = {
    sub: user.sub || user.email,
    email: user.email,
    role: user.role,
    iat: Date.now()
  };
  
  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });
  
  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  }
}