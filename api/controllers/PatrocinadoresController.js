/**
 * PatrocinadoresController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	entablero: function (req,res) {

		var id = req.param( 'id' ),
			patrocina = false;

		Tablero.findByID(id, function ( tablero ) {

			if ( tablero ) {
				Patrocinadores
					.find({ entablero: tablero.id })
					.where(
						{
							type: "box",
							ispublic: true
						}
					)
					.limit( 1 )
					.exec( function( err, patrocinadores ){
						if ( err ) {
							res.send( err, 500 );
							
						}else if( patrocinadores ){

							patrocina = patrocinadores;

							if ( req.wantsJSON ) {
								res.send( patrocina );
							} else {
								res.send( patrocina );
							}

						}else{

							res.send( false );

						}
					});
			} else {
				res.redirect('/');
			}
		});

	},

	index: function (req,res) {

		Patrocinadores.find( function( err, patrocinadores ) {
			if ( err ) {
				res.send( err, 500 );
			}else{
				if ( req.wantsJSON ) {
					Patrocinadores.watch( req );
					res.send( patrocinadores );
			    } else {
			        res.send( patrocinadores );
			    }
			}
		});

	}
};
