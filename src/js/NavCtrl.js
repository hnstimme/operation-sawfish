(function (angular) {
    'use strict';

    angular.module('app').controller('NavCtrl', function ($rootScope) {
        $rootScope.modals = {
            infoscreen: false
        };
    });
})(angular);