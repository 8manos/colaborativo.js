/**
 * Session
 * 
 * Sails session integration leans heavily on the great work already done by Express, but also unifies 
 * Socket.io with the Connect session store. It uses Connect's cookie parser to normalize configuration
 * differences between Express and Socket.io and hooks into Sails' middleware interpreter to allow you
 * to access and auto-save to `req.session` with Socket.io the same way you would with Express.
 *
 * For more information on configuring the session, check out:
 * http://sailsjs.org/#documentation
 */

var url = require('url'),
    host = '',
    port = '',
    auth = '',
    db = '';

if (process.env.REDISCLOUD_URL) {
  //console.log( "Redis URL: " + process.env.REDISCLOUD_URL)
    var redisUrl = url.parse(process.env.REDISCLOUD_URL);
    host = redisUrl.hostname,
    port = redisUrl.port;

    if (redisUrl.auth) {
      db = 
      auth = redisUrl.auth.split(":")[1];
    }
}

module.exports.session = {

  // Session secret is automatically generated when your new app is created
  // Replace at your own risk in production-- you will invalidate the cookies of your users,
  // forcing them to log in again. 
  secret: 'd206a818eab3acfbf77ed8b6a9caae74',


  // Set the session cookie expire time
  // The maxAge is set by milliseconds, the example below is for 24 hours
  //
  // cookie: {
  //   maxAge: 24 * 60 * 60 * 1000  
  // }
  

  // In production, uncomment the following lines to set up a shared redis session store
  // that can be shared across multiple Sails.js servers
  adapter: 'redis',
  //
  // The following values are optional, if no options are set a redis instance running
  // on localhost is expected.
  // Read more about options at: https://github.com/visionmedia/connect-redis
  //
  host: host,
  port: port,
  ttl: 24 * 60 * 60 * 1000,
  db: db,
  pass: auth,
  prefix: 'sess:'


  // Uncomment the following lines to use your Mongo adapter as a session store
  // adapter: 'mongo',
  //
  // host: 'localhost',
  // port: 27017,
  // db: 'sails',
  // collection: 'sessions',
  //
  // Optional Values:
  //
  // # Note: url will override other connection settings
  // url: 'mongodb://user:pass@host:port/database/collection',
  //
  // username: '',
  // password: '',
  // auto_reconnect: false,
  // ssl: false,
  // stringify: true

};
