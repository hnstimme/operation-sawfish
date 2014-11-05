var talkies = [];
(function (angular) {
    var app = angular.module('app', ['angular-loading-bar']);

    app.controller('NavCtrl', function ($scope) {
        $scope.talkie = null;
        $scope.gotoTalkie = function(id) {
            $scope.talkie.stop();
            $scope.talkie = talkies[id];
            $scope.talkie.start();
        }
    });
})(angular);