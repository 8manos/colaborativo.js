/**
 * Tablero.js
 *
 * @description :: Los tableros de colaborativo, define si estan activos y sus fuentes.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
		name: {
			type: 'STRING',
			required: true
		},
		active: {
			type: 'BOOLEAN',
			defaultsTo: true,
			required: true
		},
		ispublic: {
			type: 'BOOLEAN',
			defaultsTo: true,
			required: true
		},
			fuentes: {
			collection: 'fuente',
			via: 'entablero'
		},
			publicaciones: {
			collection: 'publicacion',
			via: 'entablero'
		}
	},

	findByID: function (id, cb) {
		this.findOne(id).done(function (err, tablero) {
			if (err) {
				return res.send(err,500);
			} else {
				cb(tablero);
			}
		});
	}

};
