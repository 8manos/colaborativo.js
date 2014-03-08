/**
 * InstagramService.js
 *
 * @description :: Servicio para consumir fotos usando el API de Instagram.
 * @docs		:: TODO
 */


var Instagram = require( 'instagram-node-lib' ),
    later = require('later');

Instagram.set( 'client_id', process.env.INSTAGRAM_CLIENT_ID );
Instagram.set( 'client_secret', process.env.INSTAGRAM_CLIENT_SECRET );

var openSubscriptions = {}

module.exports.RequestRecentFromTag = function( id, tag ){

	//already an open listener
	if( openSubscriptions[id] ){

		console.log("info: ".yellow + "Instagram Subscription: " + id + " is already active.")
		JobsKue.process( 'instagramRecentFromTag', function( job, done ){ GetRecentFromTag( job, done ) });
		return openSubscriptions[id];	

	}else{

		console.log("info: ".green + "Instagram recentFromTag: " + id + " Requested For Tag:", tag );

		var sched       = later.parse.text('every 1 minute'),
		    timer 		= later.setInterval(
		    									function(){ JobsKue.create( 'instagramRecentFromTag', { id: id, tag: tag }, 0, 3000 ) }, 
		    									sched 
		    								);

		/* Add Subscription to openSubscriptions */ 
		openSubscriptions[id] = timer;		
	}
}

	function GetRecentFromTag( job, done ){
		console.log("info: ".green + "Saving recent instagram entries with tag: " + job.data.tag + ". From fuente: " + job.data.id );

		Instagram.tags.recent({ 
			name: job.data.tag,
			complete: function( data ){
				console.log( data.length );
			}
		});
		// console.log ( publicaciones );
		setTimeout ( function() {
						console.log("info: ".green + "Saving images done");
						done();
					}, 3000 );
	}


module.exports.StopRecentFromTag = function( id ){
	if( openSubscriptions[id] ){
		console.log("info: ".yellow + "Disconnecting from instagram recent tag: " + id );
		openSubscriptions[id].clear();
		delete openSubscriptions[id];
	}else{
		console.log("info: ".green + "Instagram recent tag: " + id + " is already disconnected.");
	}
}