(function (angular) {
    'use strict';

    angular.module('app').directive('trackEscape', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.bind('keyup', function (event) {
                    if (event.which === 27) {
                        scope.$broadcast('escape');
                    }
                });
            }
        }
    });
})(angular);