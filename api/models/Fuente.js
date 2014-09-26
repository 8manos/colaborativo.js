/**
 * Fuente.js
 *
 * @description :: Las fuentes de cada tablero, cada una tiene una red a la que pertenece, un query, y un tablero al que alimenta.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
		network: {
			type: 'STRING',
			required: true
		},
		query: {
			type: 'STRING',
			required: true
		},
		active: {
			type: 'BOOLEAN',
			defaultsTo: true,
			required: true
		},
		entablero:{
			model: 'Tablero'
		},
		publicaciones: {
			collection: 'publicacion',
			via: 'defuente'
		}
	}

};
