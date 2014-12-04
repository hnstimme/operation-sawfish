(function (angular) {
    'use strict';

    angular.module('app').controller('AudioCtrl', function ($scope, $translate) {
        $scope.videogularConfig = {
            sources: [{src: "audio/Kapitel_1_deutsch.mp3", type: "audio/mp3"}],
            objectType: 'audio'
        };
        $scope.videogularAPI = null;
        $scope.onPlayerReady = function (API) {
            $scope.videogularAPI = API;
        };
        $scope.modals = {
            infoscreen: false
        };
        moment.locale($translate.use());
        $scope.changeLanguage = function () {
            $translate.use($translate.use() === 'en' ? 'de' : 'en');
            moment.locale($translate.use());
        };
    });
})(angular);