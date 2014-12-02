(function (angular) {
    'use strict';
    angular.module('app').filter('svgHref', function ($location) {
        return function (id) {
            return $location.path() + "#" + id;
        };
    });
})(angular);