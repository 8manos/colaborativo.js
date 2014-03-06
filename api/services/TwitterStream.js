/**
 * TwitterStream.js
 *
 * @description :: Servicio para consumir twits usando el streaming API de Twitter.
 * @docs		:: TODO
 */


var Twit = require('twit')
 
var twitterConnection = new Twit({
	consumer_key: process.env.T_CONSUMER_KEY
  , consumer_secret: process.env.T_CONSUMER_SECRET
  , access_token: process.env.T_ACCESS_TOKEN
  , access_token_secret: process.env.T_ACCESS_SECRET
})
 
 
var openStreams = {}
 
// id : the id of the requested stream
// url : what path to listen to
// event : stream event to listen for
// options : parameters for the stram API
// tablero : the tablero where current stream belongs
module.exports.listenToStream = function( id, url , event , options, tablero ){

	console.log("info: ".green + "Twitter Stream: " + id + " Requested With Options:", options );
	
	//already an open listener
	if( openStreams[id] ){

		console.log("info: ".yellow + "Twitter stream: " + id + " is already active.")
		return openStreams[id];	

	}else{

		console.log("info: ".green + "Connecting to twitter stream: "+ id );

		var stream = twitterConnection.stream( url , options );
	 
	 	/* On Stream Connect */
	 	stream.on( 'connect' , function( request ){
	 		console.log( "info: ".green + "Connected to twitter stream: "+ id );
	 	});

	 	/* On Stream Reconnect */
	 	stream.on( 'reconnect' , function (request, response, connectInterval) {
			console.log( "info: ".green + "Reconnected to twitter stream: "+ id );
		});

	 	/* On New Tweet from stream */
		stream.on( event , function ( tweet ){
			Publicacion.create({
				entablero: tablero,
				defuente: id,
				red: 'twitter',
				tipo: 'tweet',
				data: tweet
			}).done(function(err, publicacion) {
				if (err) {
					return console.log(err);

				}else {
					console.log("info: ".green + "Publicacion saved:", publicacion.id + " from fuente: " + id + ". Author: @" + publicacion.data.user.screen_name );
				}
			});
		});

		/* On Stream Tweet Delete */
		stream.on( 'delete' , function ( deleteMessage ) {
			console.log( "info: ".red + "Tweet Deleted from Twitter: ", deleteMessage );
		});

		/* On location deletion message */
		stream.on( 'scrub_geo' , function ( scrubGeoMessage ) {
			console.log( "info: ".red + "Tweet Location Deleted from Twitter: ", scrubGeoMessage );
		});

		/* On tweet was withheld in certain countries. */
		stream.on( 'status_withheld' , function ( withheldMsg ) {
		  console.log( "info: ".yellow + "Tweet was withheld in certain countries: ", withheldMsg );
		});

		/* On user was withheld in certain countries. */
		stream.on( 'user_withheld' , function ( withheldMsg ) {
		  console.log( "info: ".yellow + "User was withheld in certain countries: ", withheldMsg );
		});

		/* On Stream Warning Message */
		stream.on( 'warning' , function ( warning ) {
			console.log( "warning: ".red + "Twitter Stream Warning: ", warning );
		});

		/* On Stream Limit Message */
		stream.on( 'limit' , function ( limitMessage ) {
		  console.log( "info: ".yellow + "Incoming Stream Limit Message: ", limitMessage );
		});

		/* On Stream Disconnect */
		stream.on( 'disconnect' , function( disconnectMessage ){
	 		console.log( "info: ".red + "Disconnected from twitter stream: "+ id + " with message: ", disconnectMessage );
	 		delete openStreams[id];
	 	});
	 
	 	/* Add Stream to Open Streams */ 
		openStreams[id] = stream;
	 
		return stream;	

	}
	
}
 
module.exports.closeStream = function( id ){
	if( openStreams[id] ){

		console.log("info: ".green + "Closing twitter stream: " + id );
		openStreams[id].stop();
		delete openStreams[id];

	}else{
		console.log( "info: ".yellow + "Twitter stream " + id + " is already closed.");
	}
}
 
module.exports.reopenStream = function( id ){
	if(openStreams[id]) openStreams[id].start()
}