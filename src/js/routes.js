(function (angular) {
    'use strict';
    angular.module('app').config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {
                templateUrl: 'partials/start.html'
            })
            .when('/video', {
                controller: function ($scope) {
                    $scope.videogularConfig.sources = [{src: "audio/1.mp3", type: "audio/mp3"}]
                },
                templateUrl: 'partials/video.html'
            })
            .when('/targetSelection', {
                controller: function ($scope) {
                    $scope.videogularConfig.sources = [{src: "audio/2.mp3", type: "audio/mp3"}]
                },
                templateUrl: 'partials/targetSelection.html'
            })
            .when('/flight', {
                controller: function ($scope) {
                    $scope.videogularConfig.sources = [{src: "audio/3.mp3", type: "audio/mp3"}]
                },
                templateUrl: 'partials/flight.html'
            })
            .when('/bombing', {
                controller: function ($scope) {
                    $scope.videogularConfig.sources = [{src: "audio/4.mp3", type: "audio/mp3"}]
                },
                templateUrl: 'partials/bombing.html'
            })
            .when('/destruction', {
                controller: function ($scope) {
                    $scope.videogularConfig.sources = [{src: "audio/5.mp3", type: "audio/mp3"}]
                },
                templateUrl: 'partials/destruction.html'
            })
            .when('/comparison', {
                controller: function ($scope) {
                    $scope.videogularConfig.sources = [{src: "audio/6.mp3", type: "audio/mp3"}]
                },
                templateUrl: 'partials/comparison.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
})(angular);