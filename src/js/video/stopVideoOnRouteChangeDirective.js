(function (angular) {
    'use strict';
    angular.module('app').directive("stopVideoOnRouteChange", function ($rootScope) {
        return {
            restrict: "A",
            require: "^videogular",
            link: function (scope, elem, attrs, API) {
                $rootScope.$on('$routeChangeStart', function () {
                    API.stop();
                });
            }
        }
    });
})(angular);