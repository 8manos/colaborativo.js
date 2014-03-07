/**
 * InstagramService.js
 *
 * @description :: Servicio para consumir fotos usando el API de Instagram.
 * @docs		:: TODO
 */


Instagram = require( 'instagram-node-lib' );

Instagram.set( 'client_id', process.env.INSTAGRAM_CLIENT_ID );
Instagram.set( 'client_secret', process.env.INSTAGRAM_CLIENT_SECRET );

var openSusbscriptions = {}

module.exports.recentFromTag = function( id, tag ){
	console.log("info: ".green + "Instagram recentFromTag: " + id + " Requested For Tag:", tag );

	// console.log( Instagram.tags.recent({ name: tag, max_tag_id: 0, min_tag_id: 1394257944016 }) );
}
