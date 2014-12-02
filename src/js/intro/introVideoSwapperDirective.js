(function (angular) {
    'use strict';
    angular.module('app').directive("introVideoSwapper", function ($timeout) {
        return {
            restrict: "A",
            require: "^videogular",
            link: function (scope, elem, attrs, API) {
                scope.fullVideoConfigured = false;
                scope.showFullVideo = function () {
                    API.clearMedia();
                    scope.fullVideoIsLoading = true;
                    scope.fullVideoConfigured = true;
                    scope.videogularConfig.sources = [{
                        src: "mov/film_komplett.mp4",
                        type: "video/mp4"
                    }, {
                        src: "mov/film_komplett.ogg",
                        type: "video/ogg"
                    }];

                    var tryToPlayPromise;
                    var tryToPlay = function () {
                        tryToPlayPromise = $timeout(function () {
                            if (scope.fullVideoIsLoading) {
                                API.play();
                                tryToPlay();
                            }
                        }, 100, false);
                    };
                    tryToPlay();

                    var unbindWatcher = scope.$watch(function () {
                        return API.currentState;
                    }, function (newVal) {
                        if (newVal === 'play') {
                            scope.fullVideoIsLoading = false;
                            unbindWatcher();
                            $timeout.cancel(tryToPlayPromise);
                        }
                    });

                    scope.$on('$destroy', function () {
                        unbindWatcher();
                        $timeout.cancel(tryToPlayPromise);
                    });
                };
            }
        }
    });
})(angular);