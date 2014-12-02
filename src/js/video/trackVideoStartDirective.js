(function (angular) {
    'use strict';
    angular.module('app').directive("trackVideoStart", function () {
        return {
            restrict: "A",
            require: "^videogular",
            link: function (scope, elem, attrs, API) {
                scope.videoHasStarted = false;
                var unbindWatcher = scope.$watch(function () {
                    return API.currentState;
                }, function (newVal) {
                    if (newVal === 'play' || newVal === 'pause') {
                        scope.videoHasStarted = true;
                        scope.$emit('videoHasStarted');
                        unbindWatcher();
                    }
                });
            }
        }
    });
})(angular);