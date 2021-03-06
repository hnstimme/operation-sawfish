(function (angular) {
    'use strict';

    angular.module('app').controller('AudioCtrl', function ($scope) {
        $scope.videogularConfig = {
            sources: [{src: "audio/Kapitel_1_deutsch.mp3", type: "audio/mp3"}],
            objectType: 'audio'
        };
        $scope.videogularAPI = null;
        $scope.onPlayerReady = function (API) {
            $scope.videogularAPI = API;
        };
    });
})(angular);