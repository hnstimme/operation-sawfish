(function (angular) {
    'use strict';
    angular.module('app').controller('IntroController', function ($scope, $translate) {
        $scope.videogularConfig.sources = [{
            src: "mov/Video_" + $translate.instant('AUDIO_SUFFIX') + ".mp4",
            type: "video/mp4"
        }, {
            src: "mov/Video_" + $translate.instant('AUDIO_SUFFIX') + ".oggtheora.ogv",
            type: "video/ogg"
        }];
        $scope.videogularConfig.objectType = 'video';
        $scope.videogularConfig.plugins = {
            poster: "img/film_poster.jpg"
        };
    });
})(angular);