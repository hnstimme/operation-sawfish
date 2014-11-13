(function (angular) {
    'use strict';

    angular.module('app').controller('NavCtrl', function ($scope, $location) {
        $scope.gotoTalkie = function (id) {
            $location.href('/')
        }
    });
})(angular);