(function (angular) {
    'use strict';

    angular.module('app').controller('IntroController', function ($scope) {
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
    });

    angular.module('app').directive("videogularApi", function () {
        return {
            restrict: "A",
            require: "^videogular",
            link: function (scope, elem, attrs, API) {
                scope.videogularAPI = API;
            }
        }
    });

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

    angular.module('app').directive("trackVideoStart", function ($analytics) {
        return {
            restrict: "A",
            require: "^videogular",
            link: function (scope, elem, attrs, API) {
                scope.videoHasStarted = false;
                var unbindWatcher = scope.$watch(function () {
                    return API.currentState;
                }, function (newVal) {
                    if (newVal === 'play' || newVal === 'pause') {
                        $analytics.eventTrack('playing', {
                            category: 'Heilbronn brennt'
                        });
                        scope.videoHasStarted = true;
                        unbindWatcher();
                    }
                });
            }
        }
    });
})(angular);