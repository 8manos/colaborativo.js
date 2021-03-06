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
		logo: {
			type: 'STRING'
		},
		slogan: {
			type: 'STRING'
		},
		slug: {
			type: 'STRING',
			required: true,
			unique: true
		},
		fuentes: {
			collection: 'Fuente',
			via: 'entablero'
		},
		publicaciones: {
			collection: 'publicacion',
			via: 'entablero'
		},
		patrocinadores: {
			collection: 'patrocinadores',
			via: 'entablero'
		},
		theme: {
			model: 'theme'
		},
		stats: {
			model: 'stats'
		}
	},

	findByID: function (id, cb) {
		this.findOne(id).exec(function (err, tablero) {
			if (err) {
				return res.send(err,500);
			} else {
				cb(tablero);
			}
		});
	}

};
