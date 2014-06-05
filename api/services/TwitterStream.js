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
 
 
var openStreams = {};
var requestedStreams = {};

module.exports.requestStream = function( id, url , event , options, tablero ){
	console.log("info: ".green + "Twitter Stream Job: " + id + " Requested With Options:", options );

	// already in kue
	if( requestedStreams[id] ){

		console.log("info: ".yellow + "Twitter stream: " + id + " is already requested.")


	}else{
		//already an open listener
		if( openStreams[id] ){

			console.log("info: ".yellow + "Twitter stream: " + id + " is already active.")

		}else{
			console.log("info: ".yellow + "Creating Twitter stream job: " + id );
			JobsKue.create( 'twitterStream', { 
				title: 'twitterStream: ' + options.track,
				id: id, 
				options: options, 
				tablero: tablero,
				url: url,
				event: event 
			}, 0, 3000 );

			requestedStreams[id] = id;
		}	
	}

}
 
// id : the id of the requested stream
// url : what path to listen to
// event : stream event to listen for
// options : parameters for the stram API
// tablero : the tablero where current stream belongs
module.exports.listenToStream = function( job, done ){

	FuentesService.checkActive( job.data.id, function(){
		console.log("info: ".green + "Twitter Stream: " + job.data.id + " Requested With Options:", job.data.options );
		
		//already an open listener
		if( openStreams[job.data.id] ){

			console.log("info: ".yellow + "Twitter stream: " + job.data.id + " is already active.")
			done();

		}else{

			console.log("info: ".green + "Connecting to twitter stream: "+ job.data.id );

			var stream = twitterConnection.stream( job.data.url , job.data.options );
		 
		 	var i = 0;

		 	/* On Stream Connect */
		 	stream.on( 'connect' , function( request ){
		 		console.log( "info: ".green + "Connected to twitter stream: "+ job.data.id );

		 		delete requestedStreams[job.data.id];

		 		var I = setInterval(
		 			function (){
		 				i++;
			 			job.progress( i, 330 );
			 			if( i === 330 ){
		 					TwitterStream.closeStream( job.data.id );
		 					console.log( "DESCONECTANDO".red, job.data.id );
		 					done();
			 				clearInterval(I);
			 			}
		 			}
		 		, 1000 );


		 	});

		 	/* On Stream Reconnect */
		 	stream.on( 'reconnect' , function (request, response, connectInterval) {
				console.log( "info: ".green + "Reconnected to twitter stream: "+ job.data.id );
			});

		 	/* On New Tweet from stream */
			stream.on( job.data.event , function ( tweet ){

				var options = [ 'no-color-block', 'no-color-block', 'color-block' ];
				var color = Math.floor((Math.random()*7));
				var value = Math.floor((Math.random()*3));
	 
				Publicacion.create({
					entablero: job.data.tablero,
					origin_id: job.data.tablero + "_" + tweet.id_str,
					defuente: job.data.id,
					red: 'twitter',
					tipo: 'tweet',
					color_class: options[ value ] + ' color-' + color,
					data: tweet
				}).exec(function(err, publicacion) {
					if (err) {
						return console.log(err);

					}else {
						console.log("info: ".green + "Publicacion saved:", publicacion.id + " from fuente: " + job.data.id + ". Author: @" + publicacion.data.user.screen_name );

							if( !publicacion.data.retweeted_status ){
								Publicacion.publishCreate({
								  id: job.data.tablero,
								  data: publicacion
								});
							}else{
								console.log("info: ".green + "Omitiendo anuncio de retweet");
							}
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
		 		console.log( "info: ".red + "Disconnected from twitter stream: "+ job.data.id + " with message: ", disconnectMessage );
		 		delete openStreams[job.data.id];

		 		var err = new Error( disconnectMessage );
							  job.failed().error(err);
							  done(err);
		 	});
		 
		 	/* Add Stream to Open Streams */ 
			openStreams[job.data.id] = stream;
		 
			return stream;	

		}
	}, done );
	
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