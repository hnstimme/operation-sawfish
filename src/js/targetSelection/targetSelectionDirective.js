(function (angular) {
    'use strict';

    var map = {
        leafletMap: null,
        init: function () {
            this.leafletMap = L.map('map', {
                center: [50.665691, 10.451526],
                zoom: 7,
                minZoom: 5,
                maxZoom: 12
            });

            this.addTileLayer();
        },
        addTileLayer: function () {
            var attribution = '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>';
            L.tileLayer('https://{s}.tiles.mapbox.com/v3/pascalgabriel.k28h1mih/{z}/{x}/{y}.png', {
                'maxZoom': 18,
                'attribution': attribution
            }).addTo(this.leafletMap);
        }
    };

    angular.module('app.explore').directive('map', function ($http, $filter, $q) {
        return {
            restrict: 'E',
            template: '<div id="map"></div>',
            replace: true,
            link: function (scope, element) {
                map.numberFormatter = $filter('number');
                map.init();
                var areaPromise = null, dataPromise = null;

                var updateAreas = function () {
                    if (scope.styleOptions.form !== 'map') return false;
                    areaPromise = $q(function (resolve, reject) {
                        map.addAreaLayer(scope.cubeFilter.level, resolve);
                    });
                    return areaPromise;
                };

                var updateData = function () {
                    if (scope.styleOptions.form !== 'map') return false;
                    var deferred = $q.defer();
                    var i = 0;
                    setTimeout(function () {
                        i++;
                        if (areaPromise != null) {
                            areaPromise.then(function () {
                                map.addData(scope.cube.data, scope.cubeConfig, scope.cubeFilter);
                            });
                            deferred.resolve();
                        }
                        if (i > 5) {
                            deferred.reject();
                        }
                    }, 200);
                    return deferred.promise;
                };

                var update = function () {
                    if (scope.styleOptions.form !== 'map') return false;
                    updateAreas();
                    updateData();
                };

                scope.$watch('styleOptions.form', update);
                scope.$watch('cubeFilter.level', updateAreas);
                scope.$watch('cube.data', updateData);
                scope.$watch('cubeConfig.relation', updateData);
            }
        };
    });

    angular.module('app').directive('targetSelection', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {

            }
        }
    });
})(angular);