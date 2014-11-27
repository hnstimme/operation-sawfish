(function (angular) {
    'use strict';

    angular.module('app').controller('AudioCtrl', function ($scope) {
        $scope.videogularConfig = {
            sources: [{src: "mov/final_film.ogg", type: "video/ogg"}],
            objectType: 'audio'
        };
    });
})(angular);