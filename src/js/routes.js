(function (angular) {
    'use strict';
    angular.module('app').config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(false);
        $routeProvider
            .when('/', {
                controller: 'IntroController',
                templateUrl: 'partials/intro.html'
            })
            .when('/targetSelection', {
                controller: function ($scope, $translate) {
                    $scope.videogularConfig.sources = [{
                        src: "audio/Kapitel_2_" + $translate.instant('AUDIO_SUFFIX') + ".mp3",
                        type: "audio/mp3"
                    }];
                    $scope.videogularConfig.objectType = 'audio';
                },
                templateUrl: 'partials/targetSelection.html'
            })
            .when('/flight', {
                controller: function ($scope, $translate) {
                    $scope.videogularConfig.sources = [{
                        src: "audio/Kapitel_3_" + $translate.instant('AUDIO_SUFFIX') + ".mp3",
                        type: "audio/mp3"
                    }];
                    $scope.videogularConfig.objectType = 'audio';
                },
                templateUrl: 'partials/flight.html'
            })
            .when('/bombing', {
                controller: function ($scope, $translate) {
                    $scope.videogularConfig.sources = [{
                        src: "audio/Kapitel_4_" + $translate.instant('AUDIO_SUFFIX') + ".mp3",
                        type: "audio/mp3"
                    }];
                    $scope.videogularConfig.objectType = 'audio';
                },
                templateUrl: 'partials/bombing.html'
            })
            .when('/destruction', {
                controller: function ($scope, $translate) {
                    $scope.videogularConfig.sources = [{
                        src: "audio/Kapitel_5_" + $translate.instant('AUDIO_SUFFIX') + ".mp3",
                        type: "audio/mp3"
                    }];
                    $scope.videogularConfig.objectType = 'audio';
                },
                templateUrl: 'partials/destruction.html'
            })
            .when('/comparison', {
                controller: function ($scope, $translate) {
                    $scope.videogularConfig.sources = [{
                        src: "audio/Kapitel_6_" + $translate.instant('AUDIO_SUFFIX') + ".mp3",
                        type: "audio/mp3"
                    }];
                    $scope.videogularConfig.objectType = 'audio';
                },
                templateUrl: 'partials/comparison.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
})(angular);