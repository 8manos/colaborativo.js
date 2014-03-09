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

module.exports.RequestRecentFromTag = function( id, tag, tablero ){

	//already an open listener
	if( openSubscriptions[id] ){

		console.log("info: ".yellow + "Instagram Subscription: " + id + " is already active.")
		return openSubscriptions[id];	

	}else{

		console.log("info: ".green + "Instagram recentFromTag: " + id + " Requested For Tag:", tag + " in tablero: " + tablero );

		var sched       = later.parse.text('every 1 minute'),
		    timer 		= later.setInterval(
		    									function(){ JobsKue.create( 'instagramRecentFromTag', { id: id, tag: tag, tablero: tablero }, 0, 3000 ) }, 
		    									sched 
		    								);

		/* Add Subscription to openSubscriptions */ 
		openSubscriptions[id] = timer;		
	}
}

module.exports.GetRecentFromTag = function( job, done ){
		console.log("info: ".green + "Saving recent instagram entries with tag: " + job.data.tag + ". From fuente: " + job.data.id );

		var min_tag_id = ''; 
		Publicacion.find().where({ defuente: job.data.id }).sort({ id: 'desc' }).limit(1).exec( function( err, publicacion ){
			if (err) {
				return console.log(err);
			}else{
				if( typeof publicacion[0] != 'undefined' ){					
					console.log("info: ".green + "La mas nueva es: ", publicacion[0].paging.min_tag_id );
					min_tag_id = publicacion[0].paging.min_tag_id;
				}else{
					min_tag_id = null;
					console.log("info: ".green + "No hay publicaciones anteriores");
				}
			}
		});

		//Instagram.tags.recent({ name: job.data.tag });

		Instagram.tags.recent({ 
			name: job.data.tag,
			min_tag_id: min_tag_id,
			complete: function( data, paging ){
				console.log("info: ".green + data.length + " images found.");
				for (var i = data.length - 1; i >= 0; i--) {
					console.log("info: ".green + "Saving image from fuente: " + job.data.id + " from user: " + data[i].user.username + " in tablero: " + job.data.tablero );

					Publicacion.create({
						entablero: job.data.tablero,
						defuente: job.data.id,
						red: 'instagram',
						tipo: data[i].type ,
						data: data[i],
						paging: paging,
					}).done(function(err, publicacion) {
						if (err) {
							return console.log(err);

						}else {
							console.log("info: ".green + "Publicacion saved:", publicacion.id + " from fuente: " + job.data.id );
						}
					});
				};
				console.log("info: ".green + "Saving images done");
				console.log("info: ".green + "Giving instagram servers a 10 second break.");
				setTimeout ( function() {
					console.log("info: ".green + "Gave instagram servers a 10 second break.");
					done();
				}, 10000 );
			}
		});

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