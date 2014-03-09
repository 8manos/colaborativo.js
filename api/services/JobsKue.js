/**
 * JobsKue.js
 *
 * @description :: Servicio para producir un kue de trabajos escalable.
 * @docs		:: TODO
 */

 var kue  = require('kue'), 
 	 url = require('url'), 
 	 redis = require('redis'),
 	 later  = require('later');

 if (process.env.REDISTOGO_URL) {
 	console.log( "Redis URL: " + process.env.REDISTOGO_URL)
    kue.redis.createClient = function() {
	    var redisUrl = url.parse(process.env.REDISTOGO_URL)
	      , client = redis.createClient(redisUrl.port, redisUrl.hostname);
	    if (redisUrl.auth) {
	        client.auth(redisUrl.auth.split(":")[1]);
	    }
	    return client;
	};
}

 var jobs = kue.createQueue();

   kue.app.set('title', 'Colaborativo Jobs');
   kue.app.listen(3000);

process.on( 'SIGTERM', function ( sig ) {
  jobs.shutdown(function(err) {
    console.log( 'Kue is shut down.', err||'' );
    process.exit( 0 );
  }, 5000 );
});

module.exports.create = function( type, params, priority, delay ){
 	var priority = priority || 0,
 		delay = delay || 0;
 	console.log("info: ".green + "Creando job tipo: " + type + ", Prioridad: " + priority + ", con Params: ", params );
 	var job = jobs.create( type, params ).priority( priority ).delay( delay ).save();
 	return job;
}

module.exports.process = function( type, callback ){
 	console.log("info: ".green + "Procesando jobs tipo: " + type);
 	jobs.process( type, callback );
 	jobs.promote( 10000 );
}

module.exports.shutdown = function () {
	jobs.shutdown( function(err) {
		console.log( 'Kue is shut down.', err||'' );
		process.exit( 0 );
	}, 5000 );
}

module.exports.aTrabajar = function () {

	console.log("info: ".green + "Fuentes check background service starting...");

	// aTrabajar();

	var sched       = later.parse.text('every 1 minute'),
		timer 		= later.setInterval( aTrabajar, sched );

	function aTrabajar(){ 
		console.log( "A trabajar");
		kue.Job.rangeByType('instagramRecentFromTag','active', 0, 10, '', function (err, jobs) {
		    if (err) { console.log(err) }
		    if (!jobs.length) {
				JobsKue.process( 'instagramRecentFromTag', function( job, done ){ InstagramService.GetRecentFromTag( job, done ) });
		    }
		});
	}
}