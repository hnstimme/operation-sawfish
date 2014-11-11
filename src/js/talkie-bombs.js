(function (angular, d3, talkies) {
    angular.module('app').controller('BController', function ($scope) {
        $scope.airplanes = [
            {begin: 0},
            {begin: 2},
            {begin: 4},
            {begin: 6}
        ]
    });

    var width = 960;
    var height = 500;


})(angular, d3, talkies);