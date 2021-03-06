(function (angular) {
    'use strict';
    angular.module('app').directive("startVideoOnClick", function ($rootScope, $timeout) {
        return {
            restrict: "A",
            require: "^videogular",
            link: function (scope, elem, attrs, API) {
                var listener;
                var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
                var activateListener = function () {
                    if (!listener && !iOS) {
                        listener = $rootScope.$on('$routeChangeSuccess', function () {
                            listener();
                            $timeout(function () {
                                API.play();
                            });
                        });
                    }
                };

                elem.on('click', function () {
                    activateListener();
                });
            }
        }
    });
})(angular);