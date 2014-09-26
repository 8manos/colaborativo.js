/**
 * UserController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var passport = require('passport');
var passwordHash = require('password-hash');

var authRedirect = function(req, res, err, user) {
  if ((err) || (!user))
  {
    console.log('error:', 'callback '+err);
    res.redirect('/user/login');
    return;
  }

  req.logIn(user, function(err)
  {
    if (err)
    {
      console.log('error:', 'login '+err);
      res.redirect('/user/login');
      return;
    }

    res.redirect('/');
    return;
  });
}

module.exports = {
  login: function (req,res)
  {
    res.view();
  },

  passport_local: function(req, res)
  {
    passport.authenticate('local', function(err, user) {
      authRedirect(req, res, err, user);
    })(req, res);
  },

  logout: function (req,res)
  {
    req.logout();
    res.redirect('/');
  },

  twitter: function (req,res)
  {
    passport.authenticate('twitter')(req, res, req.next);
  },

  twitter_callback: function (req,res)
  {
    passport.authenticate('twitter', function(err, user) {
      authRedirect(req, res, err, user);
    })(req, res);
  },

  facebook: function (req,res)
  {
    passport.authenticate('facebook')(req, res, req.next);
  },

  facebook_callback: function (req,res)
  {
    passport.authenticate('facebook', function(err, user) {
      authRedirect(req, res, err, user);
    })(req, res);
  },

  create: function (req,res) {

    var email = req.param('email');
    var hashedPassword = passwordHash.generate(req.param('password'));

    User.find({ email: email }).exec(function(err, users) {

      if (users.length > 0) {
        res.redirect('/');
        return;
      }

      User.create({
        email: email,
        password: hashedPassword
      }).exec(function(err, user) {
        res.send(user);
        return;
      });
    });
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
   _config: {}
};
