/**
 * Theme.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

/**
 * Theme.js
 *
 * @description :: Theme para el front end de los tableros.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
		name: {
			type: 'STRING',
			required: true
		},
		slug: {
			type: 'STRING',
			required: true
		},
		header_bg_color: {
			type: 'STRING',
			maxLength: 7,
			required: false
		},
		header_bg_url: {
			type: 'STRING',
			required: false
		},
		header_bg_size: {
			type: 'STRING',
			required: false
		},
		body_bg_color: {
			type: 'STRING',
			maxLength: 7,
			required: false
		},
		body_bg_url: {
			type: 'STRING',
			required: false
		},
		body_bg_size: {
			type: 'STRING',
			required: false
		}
	}

};