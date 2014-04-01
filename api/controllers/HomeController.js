/**
 * HomeController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	
	index: function (req,res) {

		Tablero.find({ ispublic: true }).done( function(err, tableros) {
			if (err) {
				res.send(err, 500);
			}else{
				res.view({ tableros: tableros })
			}
		});

	}
};
