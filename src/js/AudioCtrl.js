(function (angular) {
    'use strict';

    angular.module('app').controller('AudioCtrl', function ($scope) {
        $scope.videogularConfig = {
            sources: [],
            objectType: 'video'
        };
    });
})(angular);