(function (angular) {
    'use strict';
    angular.module('app').controller('IntroController', function ($scope, $analytics) {
        $scope.videogularConfig.sources = [{
            src: "mov/Video_deutscher_Text.mp4",
            type: "video/mp4"
        }, {
            src: "mov/Video_deutscher_Text.oggtheora.ogv",
            type: "video/ogg"
        }];
        $scope.videogularConfig.objectType = 'video';
        $scope.videogularConfig.plugins = {
            poster: "img/film_poster.jpg"
        };
        $scope.$on('videoHasStarted', function () {
            $analytics.eventTrack('playing', {
                category: 'Heilbronn brennt'
            });
        });
    });
})(angular);