const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const path = require('path');
const db = require('../routes/dbconnect.js');

// The verifying public key
const PUB_KEY = fs.readFileSync(path.join(__dirname, '../jwt_keys/id_rsa_pub.pem'), 'utf8');

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256']
};

// app.js will pass the global passport object here, and this function will configure it
module.exports = (passport) => {
    // The JWT payload is passed into the verify callback
    passport.use(new JwtStrategy(options, function(jwt_payload, done) {
        
        // Check if we have a valid sub field
        if (!jwt_payload.sub && jwt_payload.email) {
            jwt_payload.sub = jwt_payload.email; // backward compatibility
        }

        if (!jwt_payload.sub) {
            return done(null, false);
        }

        // Special handling for guest users
        if (jwt_payload.sub === 'guest@digimedia.com') {
            return done(null, {
                email: jwt_payload.sub,
                role: 'Public'
            });
        }

        // For regular users, check the database
        var connection = db.getPool();
        const query = 'SELECT * FROM dc.users WHERE Email = ' + connection.escape(jwt_payload.sub);
        
        connection.query(query, function (err, rows) {
            if (err) {
                console.error("Couldn't query user email:", err);
                return done(err, false);
            }
            else {
                // If an email was found...
                if (rows[0]) {
                    return done(null, {
                        email: jwt_payload.sub,
                        role: 'User'
                    });
                } else {
                    return done(null, false);
                }
            } 
        });
    }));
}