/**
 * Bootstrap
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.bootstrap = function (cb) {

	console.log("                                                                                                                              ");
	console.log("                                                                                                                              ");
	console.log("                                                                                                                              ");
	console.log(" 	   dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    ");
	console.log(" 	  dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP     ");
	console.log(" 	 dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP      ");
	console.log(" 	dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP    dP       ");
	console.log(" 	                                                                                                                           ");
	console.log(" 	                                                                                                                           ");
	console.log(" 	                                                                                                                           ");
	console.log(" 	                                                                                                                           ");
	console.log(" 	 dP\"\"b8  dP\"Yb  88        db    88\"\"Yb  dP\"Yb  88\"\"Yb    db    888888 88 Yb    dP  dP\"Yb       dP\"\"b8  dP\"Yb   ");
	console.log(" 	dP   `\" dP   Yb 88       dPYb   88__dP dP   Yb 88__dP   dPYb     88   88  Yb  dP  dP   Yb     dP   `\" dP   Yb            ");
	console.log(" 	Yb      Yb   dP 88  .o  dP__Yb  88\"\"Yb Yb   dP 88\"Yb   dP__Yb    88   88   YbdP   Yb   dP .o. Yb      Yb   dP           ");
	console.log(" 	 YboodP  YbodP  88ood8 dP\"\"\"\"Yb 88oodP  YbodP  88  Yb dP\"\"\"\"Yb   88   88    YP     YbodP  `\"'  YboodP  YbodP      ");
	console.log(" 	                                                                                                                           ");
	console.log(" 	                                                                                                                           ");
	console.log(" 	                                                                                                                           ");
	console.log(" 	Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb       ");
	console.log(" 	 Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb      ");
	console.log(" 	  Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb     ");
	console.log(" 	   Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    Yb    ");
	console.log("                                                                                                                              ");
	console.log("                                                                                                                              ");			

	
	/* We will check for needed connections after app starts */ 
	setTimeout( function() { var C = FuentesService.start() } , 5000 );

	setTimeout( function() { 
		var jobHandles = {
				"twitter": {
					handle:	"twitterStream",
					concurrency: 2
				},
				"instagram": {
					handle: "instagramRecentFromTag",
					concurrency: 1
				}
		};

		// console.log( "LENGTH: " + jobHandles.length);

		for ( key in jobHandles ) {
			if (jobHandles.hasOwnProperty(key)){
				var C = JobsKue.aTrabajar( jobHandles[key].handle, jobHandles[key].concurrency );
			}
		};

	} , 5000 );																					   

	cb();
};