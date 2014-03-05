/**
 * PublicacionController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	stream: function (req,res) {
		var statusStream = TwitterStream.listenToStream( 'statuses/filter', 'tweet' , { track: 'colombia' } );
		res.send( "Twitter stream requested" );
	}
};
