(function (angular) {
    'use strict';

    angular.module('app').controller('InfoCtrl', function ($scope) {
	$scope.fadeIn = function(){
	    this.fadeMe = true;
	    console.log("FadeIn");
	};
    });
})(angular);