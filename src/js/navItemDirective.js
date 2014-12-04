(function (angular) {
    'use strict';
    angular.module('app').directive("navItem", function ($rootScope, $location) {
        return {
            restrict: "E",
            replace: true,
            scope: {number: '@number', href: '@href'},
            template: '<a ng-class="cssClasses"><span class="chapter-number">{{number}}</span><span class="chapter-title">{{\'CHAPTER_\' + number | translate}}</span></a>',
            link: function (scope, elem) {
                $rootScope.$on('$routeChangeSuccess', function () {
                    scope.cssClasses = $location.path() === scope.href ? 'active' : '';
                })
            }
        }
    });
})(angular);