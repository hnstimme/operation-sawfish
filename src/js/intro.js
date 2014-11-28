(function (angular) {
    'use strict';

    angular.module('app').controller('IntroController', function ($scope) {
        $scope.showVideo = false;
        $scope.videogularConfig.sources = [{
            src: "mov/final_film.mp4",
            type: "video/mp4"
        }, {
            src: "mov/final_film.ogg",
            type: "video/ogg"
        }];
        $scope.videogularConfig.objectType = 'video';
        $scope.videogularConfig.plugins = {
            poster: "img/film_poster.jpg"
        };
        $scope.play = function () {
            angular.element(document.getElementById('intro-video')).find('video')[0].play();
        }
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