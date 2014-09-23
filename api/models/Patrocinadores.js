/**
 * Patrocinadores.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
		name: {
			type: 'STRING',
			required: true
		},
		image: {
			type: 'STRING',
			required: true
		},
		ispublic: {
			type: 'BOOLEAN',
			defaultsTo: true,
			required: true
		},
		url: {
			type: 'STRING',
			required: true
		},
		type: { // banner o box
			type: 'STRING',
			required: false,
			defaultsTo: 'banner'
		},
		entablero: {
			model: 'tablero'
		}
	}

};
