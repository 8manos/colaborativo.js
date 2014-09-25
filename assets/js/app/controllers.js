/* Controllers */
var controllers = angular.module('colaborativo.controllers', ['ngSails']);

controllers.controller('AppCtrl', function ($scope, $sails) {
  $scope.tableros = [];

  (function () {
	$sails.get("/tablero", function (data) {
	  $scope.tableros = data;
	});

	$sails.on("tablero", function (message) {
	  if (message.verb === "created") {
		$scope.tableros.push(message.data);
	  }
	});
  }());
});

controllers.controller('TableroCtrl', function ($scope, $ocModal, $attrs, $sails, Tablero, Publicacion) {
  $scope.tablero = [];
  $scope.publicaciones = [];
  var tablero_id = $attrs.id;

  $scope.tablero.unshift( Tablero.get({ id: tablero_id }) );
  // $scope.publicaciones = Publicacion.get({ id: tablero_id });

  (function () {
  	

	$sails.get("/publicacion/entablero",{ id: tablero_id }, function (data) {
	  $scope.publicaciones = data;
	});

	$sails.on("tablero", function (message) {
		// console.log( "MENSAJE: ", message.data.id );

		if ( message.verb === "updated" && message.data.ispublic === false ) {
			for( var i = $scope.publicaciones.length - 1; i >= 0; i-- ) {
				if( $scope.publicaciones[i].id === message.data.id ) {
					$scope.publicaciones.splice(i, 1);
				}
			}
		}
	});
  	
	$sails.on("publicacion", function (message) {
	  // console.log( "MENSAJE: ", message );
	  if (message.verb === "created") {
	  	if(message.id === tablero_id ){
	  		// console.log(message);
			$scope.publicaciones.unshift( message.data.data );
	  	}
	  }
	});

	function funca( message ){
		console.log( message[0] );

		$scope.publicaciones.push( message[0] );
		$scope.$apply();

		// console.log( $scope.publicaciones );
	}

	function createInterval( f,dynamicParameter,interval ) { 
		setInterval( function() { 
			f( dynamicParameter ); 
		}, interval ); 
	}

	$sails.get("/patrocinadores/entablero",{ id: tablero_id }, function (data) {

		createInterval( funca, data, 180000 );

	});

  }());
});

controllers.controller('SingleCtrl', function ($scope, $init, $sails) {

  (function () {
  	console.log( "SingleCtrl", $scope.publicacion );
	/* $sails.get("/tablero", function (data) {
	  $scope.tableros = data;
	}); */

  }());
});