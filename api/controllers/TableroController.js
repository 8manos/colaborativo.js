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

		Tablero.find({ slug: slug }).exec( function ( err, tableros ) {

			if ( tableros.length > 0 ) {

				tablero = tableros[0];

				Publicacion.find({ entablero: tablero.id }).where({ ispublic: true }).limit(10).sort({ createdAt: 'desc' }).exec( function( err, publicaciones ){
					if( publicaciones ){
						publicaciones = publicaciones;
					}

					Theme.findByID( tablero.theme, function( theme ) {

						if( theme ){
							theme = theme;
						}

						Patrocinadores.find({ entablero: tablero.id }).where({ type: "banner" }).limit(1).exec( function( err, patrocinadores ){

							if( patrocinadores ){
								patrocinadores = patrocinadores;
							}
							
							if ( req.wantsJSON ) {
								res.send( tablero );
							} else {
								res.view({ tablero: tablero, publicaciones: publicaciones, theme: theme, patrocinadores: patrocinadores, isAutenticated: req.isAuthenticated() });
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

				Fuente.find({ entablero: tablero.id }).exec( function( err, fuentesfind ) { 

					if( fuentesfind ){
						fuentes = fuentesfind;
					}

					Theme.findByID( tablero.theme, function( theme ) {

						if( theme ){
							theme = theme;
						}

						Theme.find().exec( function( err, themes ){
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
	},

	counts: function (req, res) {
		var num_publicaciones = '',
			num_publicaciones_twitter = '',
			num_publicaciones_instagram = '',
			slug = req.param( 'slug' );

		Tablero.find({ slug: slug }).exec( function ( err, tableros ) {

			if ( tableros.length > 0 ) {

				tablero = tableros[0];

				Publicacion.find({ entablero: tablero.id }).exec( function( err, publicaciones ) {

					if( publicaciones ){
						num_publicaciones = publicaciones.length;

						Publicacion.find({ entablero: tablero.id }).where({ red: 'instagram' }).exec( function( err, publicaciones_instagram ) { 

							num_publicaciones_instagram = publicaciones_instagram.length;

							Publicacion.find({ entablero: tablero.id }).where({ red: 'twitter' }).exec( function( err, publicaciones_twitter ) {

								num_publicaciones_twitter = publicaciones_twitter.length;

								var counts = {
									publicaciones: {
										total: num_publicaciones,
										instagram: num_publicaciones_instagram,
										twitter: num_publicaciones_twitter
									}
								}

								res.send( counts );

							});

						
						});
					}

				});
			}
		});

	},

	post: function(req, res){

		var theme = null,
			tablero = null,
			slug = req.param( 'slug' );

		Tablero.find({ slug: slug }).exec( function ( err, tableros ) {

			if ( tableros.length > 0 ) {

				tablero = tableros[0];
				

				Theme.findByID( tablero.theme, function( theme ) {

					if( theme ){
						theme = theme;
					}

					res.view({ tablero: tablero, theme: theme });

				});

			} else {
				res.redirect('/');
			}

		});
	}
};
