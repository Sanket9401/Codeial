const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const env = require('./environment');

let opts = {
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : env.jwt_secret
}

passport.use(new JWTStrategy(opts,async function(jwtPayLoad, done){
    try{
    let user = await User.findById(jwtPayLoad._id);
        if(user){
            return done(null, user);
        }
        else{
            return done(null, false);
        }

    }
    catch(err){
        console.log('Error in finding user from JWT', err);
        return;
    }

}));

module.exports = passport;

