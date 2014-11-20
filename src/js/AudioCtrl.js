(function (angular) {
    'use strict';

    angular.module('app').controller('AudioCtrl',
    function ($sce, $scope) {
	$scope.config = {sources: [{src: $sce.trustAsResourceUrl("audio/1.mp3"), type: "audio/mpeg"}],
	    theme: {url: "css/style.css"}
	};
    });
})(angular);