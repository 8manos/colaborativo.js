(function(angular, undefined){
    'use strict';

    function fakeNgModel(initValue){
        return {
            $setViewValue: function(value){
                this.$viewValue = value;
            },
            $viewValue: initValue
        };
    }

    angular.module('luegg.directives', []);
    
}(angular));

var app = angular.module('colaborativo', [ 'ngResource', 'ngSanitize', 'twitterFilters', 'luegg.directives', 'angularMoment', 'colaborativo.controllers' ]);


// Factories
app.factory('Tablero', ['$resource', function($resource){
    return $resource('/tablero/:id', {id:'@id'});
}]);

app.factory('Publicacion', ['$resource', function($resource){
    return $resource('/publicacion/entablero/:id', {id:'@id'}, { get: { method:'GET', params:{ id:''}, isArray:true } });
}]);


// Directives
var dannyPackery = app.directive('dannyPackery', ['$rootScope', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            console.log('Running dannyPackery linking function!');
            if($rootScope.packery === undefined || $rootScope.packery === null){
                console.log('making packery!');
                $rootScope.packery = new Packery(element[0].parentElement, {
                													gutter: 0,
                                                                    transitionDuration: '0.2s'
                												});
                $rootScope.packery.bindResize();
                $rootScope.packery.prepended(element[0]);
                $rootScope.packery.items.splice(1,1); // hack to fix a bug where the first element was added twice in two different positions
            }
            else{
                $rootScope.packery.prepended(element[0]);
            }
            setInterval(
                function(){
                    $rootScope.packery.layout();
                },
                100
                );
            $rootScope.packery.layout();
        }
    };
}]);
