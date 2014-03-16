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

    angular.module('luegg.directives', [])
    .directive('scrollGlue', function(){
        return {
            priority: 1,
            require: ['?ngModel'],
            restrict: 'A',
            link: function(scope, $el, attrs, ctrls){
                var el = $el[0],
                    ngModel = ctrls[0] || fakeNgModel(true);

                function scrollToBottom(){
                    var timeout = setTimeout( function(){
                        console.log("scrolling");
                        el.scrollTop = el.scrollHeight;
                    }, 1500);
                }

                function shouldActivateAutoScroll(){
                    // + 1 catches off by one errors in chrome
                    return el.scrollTop + el.clientHeight + 1 >= el.scrollHeight;
                }

                scope.$watch(function(){
                    if(ngModel.$viewValue){
                        scrollToBottom();
                    }
                });

                $el.bind('scroll', function(){
                    scope.$apply(ngModel.$setViewValue.bind(ngModel, shouldActivateAutoScroll()));
                });
            }
        };
    });
}(angular));

var app = angular.module('colaborativo', [ 'ngResource', 'luegg.directives', 'angularMoment', 'colaborativo.controllers' ]);


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
                                                                    transitionDuration: 0
                												});
                $rootScope.packery.bindResize();
                $rootScope.packery.appended(element[0]);
                $rootScope.packery.items.splice(1,1); // hack to fix a bug where the first element was added twice in two different positions
            }
            else{
                $rootScope.packery.appended(element[0]);
            }
            $rootScope.packery.layout();
        }
    };
}]);
