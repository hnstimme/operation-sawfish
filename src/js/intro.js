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
        $scope.play = function () {
            $scope.showVideo = true;
            angular.element(document.getElementById('intro-video')).find('video')[0].play();
            $analytics.eventTrack('playing', {
                category: 'Heilbronn brennt'
            });
        }
    });
})(angular);