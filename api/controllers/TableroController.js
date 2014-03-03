/**
 * TableroController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

	index: function (req,res) {

		Tablero.find( function(err, tableros) {
			if (err) {
				res.send(err, 500);
			}else{
				Tablero.watch(req);
				res.send(tableros);
			}
		});

	}
};
