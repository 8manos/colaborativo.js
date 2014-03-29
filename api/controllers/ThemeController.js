/**
 * ThemeController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	edit: function (req, res) {
		var id = req.param( 'id' );

		Theme.findByID( id, function( theme ){
			if( theme ){
				if ( req.wantsJSON ) {
					res.send( theme );
				} else {
					res.view({ theme: theme });
				}			
			}else {
				res.redirect('/theme');
			}
		});
	}
};
