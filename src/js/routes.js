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
            .when('/flight', {
                templateUrl: 'partials/flight.html'
            })
            .when('/bombing', {
                templateUrl: 'partials/bombing.html'
            })
            .when('/destruction', {
                templateUrl: 'partials/destruction.html'
            })
            .when('/comparison', {
                templateUrl: 'partials/comparison.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
})(angular);