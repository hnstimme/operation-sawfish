(function (angular) {
    'use strict';
    angular.module('app').filter('svgHref', function ($location) {
        return function (id) {
            return window.location.pathname + "#" + id;
        };
    });
})(angular);