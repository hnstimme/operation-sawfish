(function (angular) {
    'use strict';
    angular.module('app').config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {
                controller: 'IntroController',
                templateUrl: 'partials/intro.html'
            })
            .when('/targetSelection', {
                controller: function ($scope) {
                    $scope.videogularConfig.sources = [{src: "audio/Kapitel_2_deutsch.mp3", type: "audio/mp3"}];
                    $scope.videogularConfig.objectType = 'audio';
                    $scope.showEndscreen = false;
                },
                templateUrl: 'partials/targetSelection.html'
            })
            .when('/flight', {
                controller: function ($scope) {
                    $scope.videogularConfig.sources = [{src: "audio/Kapitel_3_deutsch.mp3", type: "audio/mp3"}];
                    $scope.videogularConfig.objectType = 'audio';
                    $scope.showEndscreen = false;
                },
                templateUrl: 'partials/flight.html'
            })
            .when('/bombing', {
                controller: function ($scope, $location) {
                    $scope.videogularConfig.sources = [{src: "audio/Kapitel_4_deutsch.mp3", type: "audio/mp3"}];
                    $scope.videogularConfig.objectType = 'audio';
                    $scope.path = $location.path();
                },
                templateUrl: 'partials/bombing.html'
            })
            .when('/destruction', {
                controller: function ($scope) {
                    $scope.videogularConfig.sources = [{src: "audio/Kapitel_5_deutsch.mp3", type: "audio/mp3"}];
                    $scope.videogularConfig.objectType = 'audio';
                },
                templateUrl: 'partials/destruction.html'
            })
            .when('/comparison', {
                controller: function ($scope) {
                    $scope.videogularConfig.sources = [{src: "audio/Kapitel_6_deutsch.mp3", type: "audio/mp3"}];
                    $scope.videogularConfig.objectType = 'audio';
                },
                templateUrl: 'partials/comparison.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
})(angular);