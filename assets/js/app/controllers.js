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

controllers.controller('TableroCtrl', function ($scope, $attrs, $sails, Tablero, Publicacion) {
  $scope.tablero = [];
  $scope.publicaciones = [];
  var tablero_id = $attrs.id;

  $scope.tablero.unshift( Tablero.get({ id: tablero_id }) );
  // $scope.publicaciones = Publicacion.get({ id: tablero_id });

  (function () {
	$sails.get("/publicacion/entablero",{ id: tablero_id }, function (data) {
	  $scope.publicaciones = data;
	});
  	
	$sails.on("publicacion", function (message) {
	  // console.log( "MENSAJE: ", message );
	  if (message.verb === "created") {
	  	if(message.id === tablero_id ){
	  		console.log(message);
			$scope.publicaciones.unshift( message.data.data );
	  	}
	  }
	});
  }());
});