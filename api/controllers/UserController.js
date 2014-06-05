/**
 * UserController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

 var passport = require('passport');
 var passwordHash = require('password-hash');

 module.exports = {
  login: function (req,res)
  {
    res.view();
  },

  passport_local: function(req, res)
  {
    passport.authenticate('local', function(err, user, info)
    {
      if ((err) || (!user))
      {
        res.redirect('/user/login');
        return;
      }

      req.logIn(user, function(err)
      {
        if (err)
        {
          res.redirect('/user/login');
          return;
        }

        res.redirect('/');
        return;
      });
    })(req, res);
  },

  logout: function (req,res)
  {
    req.logout();
    res.redirect('/');
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
