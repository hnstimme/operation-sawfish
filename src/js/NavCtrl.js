(function (angular) {
    'use strict';

    angular.module('app').controller('NavCtrl', function ($scope, $location) {
        $scope.showInfoScreen = function () {
            $scope.modals.infoScreen = !$scope.modals.infoScreen;
        }
    });
})(angular);