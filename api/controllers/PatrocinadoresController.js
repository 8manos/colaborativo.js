/**
 * PatrocinadoresController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
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
