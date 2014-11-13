(function (angular) {
    'use strict';
    angular.module('app').config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {
                templateUrl: 'partials/start.html'
            })
            .when('/video', {
                templateUrl: 'partials/video.html'
            })
            .when('/targetSelection', {
                templateUrl: 'partials/targetSelection.html'
            })
            .when('/bombing', {
                templateUrl: 'partials/bombing.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
})(angular);