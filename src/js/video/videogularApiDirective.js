(function (angular) {
    'use strict';
    angular.module('app').directive("videogularApi", function () {
        return {
            restrict: "A",
            require: "^videogular",
            link: function (scope, elem, attrs, API) {
                scope.videogularAPI = API;
            }
        }
    });
})(angular);