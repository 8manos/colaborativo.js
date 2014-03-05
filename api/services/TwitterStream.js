var Twit = require('twit')
 
var twitterConnection = new Twit({
	consumer_key: process.env.T_CONSUMER_KEY
  , consumer_secret: process.env.T_CONSUMER_SECRET
  , access_token: process.env.T_ACCESS_TOKEN
  , access_token_secret: process.env.T_ACCESS_SECRET
})
 
 
var openStreams = {}
 
//url : what path to listen to
//event : stream event to listen for
//handler : what to do when event is fired
module.exports.listenToStream = function( id, url , event , options, tablero ){

	console.log("info: ".green + "Twitter Stream Requested With Options:", options );
	
	//already an open listener
	if( openStreams[id] ){

		console.log("info: ".yellow + "Stream is already active.")
		return openStreams[id];	

	}else{

		console.log("info: ".green + "Connecting to new twitter stream.")

		var stream = twitterConnection.stream( url , options );
	 
	 	stream.on( 'connect', function( request ){
	 		console.log( "info: ".green + "Connected to twitter stream: "+ id )
	 	});

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
					console.log("info: ".green + "Publicacion saved:", publicacion.id + " from fuente: " + id );
				}
			});
		});

		stream.on( 'disconnect', function( disconnectMessage ){
	 		console.log( "info: ".red + "Disconnected from twitter stream: "+ id + " with message: ", disconnectMessage );
	 		delete openStreams[id];
	 	});
	 
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