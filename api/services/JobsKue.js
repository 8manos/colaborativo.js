/**
 * JobsKue.js
 *
 * @description :: Servicio para producir un kue de trabajos escalable.
 * @docs		:: TODO
 */

 var lodash = require('lodash'),
	 kue  = require('kue'), 
	 url = require('url'), 
	 redis = require('redis'),
	 later  = require('later');

	// Prepend the Kue routes with '/kue'
	lodash.each(['get', 'put', 'delete'], function(verb) {
	  lodash.each(kue.app.routes[verb], function(route, index, routes) {
		routes[index].path = '/kue' + route.path;
		routes[index].regexp = new RegExp(route.regexp.source.replace(/\^\\/, '^\\/kue\\'));
	  });
	});

	// The last handler should be for the /public files, pop it off and add a new one which mounts them at '/kue'
	var handler = kue.app.stack.pop();
	kue.app.stack.push({ route: '/kue', handle: handler.handle });

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
 var promoter = jobs.promote();

   kue.app.set('title', 'Colaborativo Jobs');
   kue.app.listen( process.env.PORT );

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
}

module.exports.shutdown = function () {
	jobs.shutdown( function(err) {
		console.log( 'Kue is shut down.', err||'' );
		process.exit( 0 );
	}, 0 );
}

module.exports.aTrabajar = function () {

	console.log("info: ".green + "JobsKue background service starting...");

	// aTrabajar();

	var sched       = later.parse.text('every 10 seconds'),
		timer 		= later.setInterval( aTrabajar, sched );

	var flag = false; // Para evitar process repetidos

	function aTrabajar(){ 

		kue.Job.rangeByType('instagramRecentFromTag','active', 0, 10, '', function (err, trabajo) {
		   
			if (err) { console.log(err) }

			if (!trabajo.length) {

				if( flag ){
					console.log("info: ".grey + "Ya se ha iniciado el process".grey );
				}else{
					flag = true;
					console.log("info: ".green + "No hay trabajos pendientes" );
					console.log("info: ".green + "Iniciando process" );
					JobsKue.process( 'instagramRecentFromTag', function( job, done ){ InstagramService.GetRecentFromTag( job, done ) });
				}

			}else{

				console.log("info: ".green + "PENDIENTE:" , trabajo[0].id );
				var edad = Date.now() - trabajo[0].updated_at;
				console.log("info: ".green + "Edad: ", edad);

				if( edad > 20000 ){  		
					kue.Job.get( trabajo[0].id , function (err, job) {
						if (err) return;
						job.remove(function (err) {
							if (err) throw err;
							console.log("info: ".yellow + 'removed stalled job #%d', job.id);
							// JobsKue.process( 'instagramRecentFromTag', function( job, done ){ InstagramService.GetRecentFromTag( job, done ) });
						});
					});
				}

			}
		});
	}
}