/**
 * Publicacion.js
 *
 * @description :: Publicaciones para cada uno de los tableros desde cada una de las fuentes.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
		tipo: {
			type: 'STRING',
			required: true
		},
		origin_id: {
			type: 'STRING',
			required: true,
			unique: true
		},
		red: {
			type: 'STRING',
			required: true
		},
		ispublic: {
			type: 'BOOLEAN',
			defaultsTo: true,
			required: true
		},
		defuente: {
			model: 'fuente'
		},
		entablero: {
			model: 'tablero'
		}
	}

};
