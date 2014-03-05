/**
 * PublicacionController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	stream: function (req,res) {
		var statusStream = TwitterStream.listenToStream( 'statuses/filter', 'tweet' , { track: 'colombia' } , function(tweet){

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
					console.log("Publicacion guardada:", publicacion.id );
				}
			});
		});
	}
};
