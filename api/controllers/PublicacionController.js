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
				Publicacion
					.find({ entablero: tablero.id })
					.where(
						{
							"data.retweeted_status": {"$exists": false },
							ispublic: true
						}
					)
					.limit( 50 )
					.sort({ createdAt: 'desc' })
					.exec( function( err, publicaciones ){
						if( publicaciones ){
							publicaciones = publicaciones;

							if ( req.wantsJSON ) {
								Publicacion.watch( req , {id: tablero.id} );
								Tablero.subscribe( req.socket, tablero.id );
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

	toggle_ispublic: function(req,res) {
		var id = req.param( 'id' );

		Publicacion.find({ id: id }).exec( function( err, publicacion ){
			Publicacion.update({ id: id }, { ispublic: !publicacion[0].ispublic }).exec( function( err, publicacion ){
				Tablero.publishUpdate( publicacion[0].entablero, {
					id: id,
					status: 'moderated',
					ispublic: publicacion[0].ispublic
				});
				res.send( publicacion[0].ispublic );
			});
		});
	}
};
