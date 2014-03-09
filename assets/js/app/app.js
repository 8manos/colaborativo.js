var app = angular.module('colaborativo', [ 'ngResource', 'colaborativo.controllers' ]);

app.factory('Tablero', ['$resource', function($resource){
    return $resource('/tablero/:id', {id:'@id'});
}]);

app.factory('Publicacion', ['$resource', function($resource){
    return $resource('/publicacion/entablero/:id', {id:'@id'}, { get: { method:'GET', params:{ id:''}, isArray:true } });
}]);