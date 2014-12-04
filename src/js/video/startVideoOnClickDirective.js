(function (angular) {
    'use strict';
    angular.module('app').directive("startVideoOnClick", function ($rootScope) {
        return {
            restrict: "A",
            require: "^videogular",
            link: function (scope, elem, attrs, API) {
                var listener;
                var activateListener = function () {
                    if (!listener) {
                        listener = $rootScope.$on('$routeChangeSuccess', function () {
                            listener();
                            setTimeout(function () {
                                API.play();
                            }, 1000);
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