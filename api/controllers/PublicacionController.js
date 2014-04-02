/**
 * PublicacionController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	entablero: function (req,res) {

		var id = req.param( 'id' ),
			publicaciones = [];

		Tablero.findByID(id, function ( tablero ) {

			if ( tablero ) {
				Publicacion.find({ entablero: tablero.id }).limit( 50 ).sort({ createdAt: 'desc' }).done( function( err, publicaciones ){
					if( publicaciones ){
						publicaciones = publicaciones.reverse();

						if ( req.wantsJSON ) {
							Publicacion.watch( req , {id: tablero.id} );
							res.send( publicaciones );
						} else {
							res.send( publicaciones );
						}
					}

				});
			} else {
				res.redirect('/');
			}
		});

	},
};
