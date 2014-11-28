(function (angular) {
    'use strict';

    angular.module('app').controller('ShareCtrl', function ($scope) {
	$scope.hoverIn = function(){
	    this.hoverEdit = true;
	};

	$scope.hoverOut = function(){
	    this.hoverEdit = false;
	};
    });
})(angular);