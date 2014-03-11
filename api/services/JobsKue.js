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

 if (process.env.REDISCLOUD_URL) {
	console.log( "Redis URL: " + process.env.REDISCLOUD_URL)
	kue.redis.createClient = function() {
		var redisUrl = url.parse(process.env.REDISCLOUD_URL)
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

module.exports.process = function( type, concurrency, callback ){
	var concurrency = concurrency || 1;
	console.log("info: ".green + "Procesando jobs tipo: " + type + " Concurrency: " + concurrency );
	jobs.process( type, concurrency, callback );
}

module.exports.shutdown = function () {
	jobs.shutdown( function(err) {
		console.log( 'Kue is shut down.', err||'' );
		process.exit( 0 );
	}, 0 );
}

var JobsComplete = false;

module.exports.aTrabajar = function ( jobHandle, concurrency ) {

	console.log("info: ".green + "JobsKue "+ jobHandle +" background service starting... concurrency: " + concurrency );

		if( JobsComplete === false ){
			JobsComplete = jobs.on('job complete', function (id) {
				kue.Job.get(id, function (err, job) {
					if (err) return;
					setTimeout( function(){
						job.remove(function (err) {
							if (err) throw err;
							console.log("info: ".green + 'Removed completed job #%d', job.id);
								
						});
					}, 60000 );
				});
			});
		}

	// aTrabajar();

	var sched       = later.parse.text('every 10 seconds');
		timer 		= later.setInterval( function(){ aTrabajar( jobHandle, concurrency ) }, sched );

	var flag = false; // Para evitar process repetidos

	function aTrabajar( jobHandle, concurrency ){ 

		var concurrency = concurrency || 1;

		kue.Job.rangeByType(jobHandle,'active', 0, 10, '', function (err, trabajo) {
		   
			if (err) { console.log(err) }

			if (!trabajo.length) {

				if( flag ){
					console.log("info: ".grey + "Ya se ha iniciado el process de: ".grey + jobHandle );
				}else{
					flag = true;
					console.log("info: ".green + "No hay trabajos pendientes" );
					console.log("info: ".green + "Iniciando process: " + jobHandle );
					JobsKue.process( jobHandle, concurrency, function( job, done ){ 

						if( jobHandle === "instagramRecentFromTag" ){
							InstagramService.GetRecentFromTag( job, done ) 
						}

						if( jobHandle === "twitterStream" ){
							TwitterStream.listenToStream( job, done ) 
						}

					});
				}

			}else{

				console.log("info: ".green + "PENDIENTE:" , trabajo[0].id );
				var edad = Date.now() - trabajo[0].updated_at;
				console.log("info: ".green + "Edad: ", edad);

				if( edad > 20000 ){  		
					kue.Job.get( trabajo[0].id , function (err, job) {
						if (err) return;
						job.failed(function (err) {
							if (err) throw err;
							console.log("info: ".yellow + 'removed stalled job #%d', job.id);
							// JobsKue.process( jobHandle, function( job, done ){ InstagramService.GetRecentFromTag( job, done ) });
						});
					});
				}

			}
		});
	}
}