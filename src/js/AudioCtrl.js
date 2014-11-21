(function (angular) {
    'use strict';

    angular.module('app').controller('AudioCtrl', function ($scope) {
        $scope.videogularConfig = {
            sources: null,
            theme: {url: "css/style.css"}
        };
    });
})(angular);