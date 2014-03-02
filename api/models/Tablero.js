/**
 * Tablero.js
 *
 * @description :: Los taleros de colaborativo, define si estan activos y sus fuentes.
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
           fuentes: {
            collection: 'fuente',
            via: 'entablero'
           }
	}

};
