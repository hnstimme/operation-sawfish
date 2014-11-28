(function (angular) {
    'use strict';

    angular.module('app').controller('ShareCtrl', function ($scope) {
	$scope.hoverIn = function(){
	    this.hoverEdit = true;
	    console.log("drin");
	};

	$scope.hoverOut = function(){
	    this.hoverEdit = false;
	};
    });
})(angular);