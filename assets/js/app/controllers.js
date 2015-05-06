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
  console.log( "TableroCtrl Called" );
  $scope.tablero = [];
  $scope.publicaciones = [];
  var tablero_id = $attrs.id;
  console.log( "Tablero ID: ", tablero_id );

  $scope.tablero.unshift( Tablero.get({ id: tablero_id }) );
  // $scope.publicaciones = Publicacion.get({ id: tablero_id });


  (function () {

	$scope.like = function( id ){
		var response = 1,
			i = 0,
			likes = 0;

		for( var i = $scope.publicaciones.length - 1; i >= 0; i-- ) {
			if( $scope.publicaciones[i].id === id ) {

				likes = $scope.publicaciones[i].likes || 0;
			
				$sails.post("/publicacion/like",{ id: id }, function (response) {

				});

				$scope.publicaciones[i].likes = likes+1;
			}
		}
	}
  	

	$sails.on( "connect", function(){

		$sails.get("/publicacion/entablero",{ id: tablero_id }, function (data) {
		 	console.log( "Got data: ", data );
		 	$scope.publicaciones = data;
		});
	
	});

	$sails.on("tablero", function (message) {
		// console.log( "MENSAJE: ", message.data.id );

		// Modera contenido
		if ( message.verb === "updated" && message.data.ispublic === false ) {
			for( var i = $scope.publicaciones.length - 1; i >= 0; i-- ) {
				if( $scope.publicaciones[i].id === message.data.id ) {
					$scope.publicaciones.splice(i, 1);
				}
			}
		}

		// Free like
		if ( message.verb === "updated" && message.data.likes >= 0 ) {
			for( var i = $scope.publicaciones.length - 1; i >= 0; i-- ) {
				if( $scope.publicaciones[i].id === message.data.id ) {
					$scope.publicaciones[i].likes = message.data.likes;
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

		$scope.publicaciones.unshift( message[0] );
		$scope.$apply();

		// console.log( $scope.publicaciones );
	}

	function createInterval( f,dynamicParameter,interval ) { 
		setTimeout( function() { 
			f( dynamicParameter ); 
		}, interval ); 
	}

	$sails.get("/patrocinadores/entablero",{ id: tablero_id }, function (data) {

		createInterval( funca, data, 180000 );

	});

  }());
});

controllers.controller('SingleCtrl', function ($scope, $stateParams, $init, $sails) {

  (function () {

  	console.log( "SingleCtrl", $stateParams.publicacionID );
	$sails.get("/publicacion/"+ $stateParams.publicacionID , function (data) {
	  $scope.publicacion = data;
	  console.log( $scope.publicacion );
	});

  }());
});