(function (angular) {
    'use strict';
    angular.module('app').directive("introVideoSwapper", function ($timeout) {
        return {
            restrict: "A",
            require: "^videogular",
            link: function (scope, elem, attrs, API) {
                scope.fullVideoLoaded = false;
                scope.showFullVideo = function () {
                    API.clearMedia();
                    scope.videogularConfig.sources = [{
                        src: "mov/film_komplett.mp4",
                        type: "video/mp4"
                    }];
                    $timeout(function () {
                        API.play();
                        scope.fullVideoLoaded = true;
                    }, 500);
                }
            }
        }
    });
})(angular);