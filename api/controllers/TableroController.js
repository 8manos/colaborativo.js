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
			slug = req.param( 'slug' ),
			publicaciones = [],
			theme = '',
			patrocinadores = '';

		Tablero.find({ slug: slug }).done( function ( err, tableros ) {

			if ( tableros.length > 0 ) {

				tablero = tableros[0];

				Publicacion.find({ entablero: tablero.id }).limit(10).sort({ createdAt: 'desc' }).done( function( err, publicaciones ){
					if( publicaciones ){
						publicaciones = publicaciones;
					}

					Theme.findByID( tablero.theme, function( theme ) {

						if( theme ){
							theme = theme;
						}

						Patrocinadores.find({ entablero: tablero.id }).done( function( err, patrocinadores ){

							if( patrocinadores ){
								patrocinadores = patrocinadores;
							}
							
							if ( req.wantsJSON ) {
								res.send( tablero );
							} else {
								res.view({ tablero: tablero, publicaciones: publicaciones, theme: theme, patrocinadores: patrocinadores });
							}
						});
	
					});

				});
			} else {
				res.redirect('/');
			}
		});
	}, 

	edit: function (req, res) {
		var id = req.param( 'id' ),
			fuentes = [],
			theme = null,
			themes = [];

		Tablero.findByID(id, function ( tablero ) {

			if ( tablero ) {

				Fuente.find({ entablero: tablero.id }).done( function( err, fuentes ) { 

					if( fuentes ){
						fuentes = fuentes;
					}

					Theme.findByID( tablero.theme, function( theme ) {

						if( theme ){
							theme = theme;
						}

						Theme.find().done( function( err, themes ){
							themes = themes;

							if ( req.wantsJSON ) {
								res.send( tablero );
							} else {
								res.view({ tablero: tablero, fuentes: fuentes, theme: theme, themes: themes });
							}
							
						});


					});


				});

				
			} else {
				res.redirect('/');
			}
		});
	}
};
