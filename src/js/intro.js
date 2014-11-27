(function (angular) {
    'use strict';

    angular.module('app').controller('IntroController', function ($scope, $analytics) {
        $scope.showVideo = false;
        $scope.videogularConfig.sources = [{
            src: "mov/final_film.mp4",
            type: "video/mp4"
        }, {
            src: "mov/final_film.ogg",
            type: "video/ogg"
        }];
        $scope.videogularConfig.objectType = 'video';
        var unbindWatcher = $scope.$watch('videogularAPI.currentState', function (newVal) {
            if (newVal === 'play') {
                $scope.showVideo = true;
                $analytics.eventTrack('playing', {
                    category: 'Heilbronn brennt'
                });
                unbindWatcher();
            }
        });
        $scope.playVideo = function () {
            $scope.videogularAPI.play();
        }
    });
})(angular);