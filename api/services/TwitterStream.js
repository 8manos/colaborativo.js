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
module.exports.listenToStream = function( url , event , options ){

	console.log( "Twitter Stream Requested With Options:", options );
	
	//already an open listener
	if( openStreams[url]){

		console.log( "Stream is already active.")
		return openStreams[url];	

	}else{

		console.log( "Connecting to new twitter stream.")

		var stream = twitterConnection.stream( url , options );
	 
		stream.on( event , function ( tweet ){
			Publicacion.create({
				red: 'twitter',
				tipo: 'tweet',
				data: tweet
			}).done(function(err, publicacion) {
				// Error handling
				if (err) {
					return console.log(err);

				// The User was created successfully!
				}else {
					console.log("Publicacion saved:", publicacion.id );
				}
			});
		});
	 
		openStreams[url] = stream;
	 
		return stream;	

	}
	
}
 
module.exports.closeStream = function(url){
	if(openStreams[url]) openStreams[url].close()
}
 
module.exports.reopenStream = function(url){
	if(openStreams[url]) openStreams[url].start()
}

module.exports.test = function(){
	console.log("Test Twitter request received")
}