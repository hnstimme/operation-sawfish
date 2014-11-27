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
            angular.element(document.getElementById('intro-video')).find('video')[0].play();
        }
    });

    angular.module('app').directive("showVideo", function ($analytics) {
        return {
            restrict: "A",
            require: "^videogular",
            link: function (scope, elem, attrs, API) {
                var unbindWatcher = scope.$watch(function () {
                    return API.currentState;
                }, function (newVal) {
                    if (newVal === 'play') {
                        scope.showVideo = true;
                        $analytics.eventTrack('playing', {
                            category: 'Heilbronn brennt'
                        });
                        unbindWatcher();
                    }
                });
            }
        }
    });
})(angular);