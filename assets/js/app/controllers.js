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