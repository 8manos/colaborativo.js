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
module.exports.listenToStream = function(url,event,options,handler){

	console.log( "Twitter Stream Service Starting With Options:", options );
	
	//already an open listener
	if(openStreams[url]) return openStreams[url]
	
	var stream = twitterConnection.stream( url , options );
 
	stream.on(event,handler);
 
	openStreams[url] = stream;
 
	return stream;
}
 
module.exports.closeStream = function(url){
	if(openStreams[url]) openStreams[url].close()
}
 
module.exports.reopenStream = function(url){
	if(openStreams[url]) openStreams[url].start()
}