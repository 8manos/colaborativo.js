/**
 * TableroController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

	index: function (req,res) {

		Tablero.find( function( err, tableros ) {
			if ( err ) {
				res.send( err, 500 );
			}else{
				if ( req.wantsJSON ) {
					Tablero.watch( req );
					res.send( tableros );
			    } else {
			        res.redirect( '/' );
			    }
			}
		});

	},

	show: function (req, res) {
		var id = req.param( 'id' ),
			publicaciones = [];

		Tablero.findByID(id, function ( tablero ) {

			if ( tablero ) {
				Publicacion.find({ entablero: tablero.id }).limit(10).sort({ createdAt: 'desc' }).done( function( err, publicaciones ){
					if( publicaciones ){
						publicaciones = publicaciones;
					}

					if ( req.wantsJSON ) {
						res.send( tablero );
					} else {
						res.view({ tablero: tablero, publicaciones: publicaciones });
					}
				});
			} else {
				res.redirect('/');
			}
		});
	}, 

	edit: function (req, res) {
		var id = req.param( 'id' ),
			fuentes = [];

		Tablero.findByID(id, function ( tablero ) {

			if ( tablero ) {

				Fuente.find({ entablero: tablero.id }).done( function( err, fuentes ) { 

					if( fuentes ){
						fuentes = fuentes;
					}

					if ( req.wantsJSON ) {
						res.send( tablero );
					} else {
						res.view({ tablero: tablero, fuentes: fuentes });
					}

				});

				
			} else {
				res.redirect('/');
			}
		});
	}
};
