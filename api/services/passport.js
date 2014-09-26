var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var passwordHash = require('password-hash');
var url = require('url');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOneById(id).exec(function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    User.findOne({ email: email}).exec(function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Unknown user ' + email }); }
      if ( ! passwordHash.verify(password, user.password) ) { return done(null, false, { message: 'Invalid password' }); }
      return done(null, user);
    });
  }
));

passport.use(new TwitterStrategy({
    consumerKey: process.env.T_CONSUMER_KEY,
    consumerSecret: process.env.T_CONSUMER_SECRET,
    callbackURL: url.resolve(sails.getBaseurl(), '/user/twitter/callback')
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate({
      provider: 'twitter',
      providerId: profile.id
    },{
      displayName: profile.displayName,
      provider: 'twitter',
      providerId: profile.id
    }).exec(function createFindCB(err, user){
      if (err) { return done(err); }
      done(null, user);
    });
  }
));

module.exports = passport;
