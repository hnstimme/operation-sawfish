(function (angular) {
    'use strict';

    var map = {
        leafletMap: null,
        layers: {},
        init: function () {
            this.leafletMap = L.map('comparison-map', {
                center: [51.1633, 10.4476],
                zoom: 6,
                minZoom: 5,
                maxZoom: 18
            });

            this.addTileLayer();
        },
        addTileLayer: function () {
            var attribution = '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>';
            // danielstahl.k91489gn
            L.tileLayer('https://{s}.tiles.mapbox.com/v3/danielstahl.k90gp8cm/{z}/{x}/{y}.png', {
                'maxZoom': 18,
                'attribution': attribution
            }).addTo(this.leafletMap);
        },
        addCircleMarker: function (lat, lon) {
            var marker = L.circleMarker(L.latLng(lat, lon), {
                fillColor: '#000000'
            });
            map.leafletMap.addLayer(marker);
            return marker;
        }
    };

    angular.module('app').directive('comparison', function ($http) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                map.init();
                var animate = Talkie.animate(element[0]);

                var cities = [];
                $http.get('data/cities.json').success(function (geojson) {
                    cities = geojson.features;
                });

                // TODO setTimeout is a temporary workaround
                setTimeout(function () {
                    var timelineDef = {};
                    var startMoment = moment("01021942", "DDMMYYYY");
                    var endMoment = moment("30081943", "DDMMYYYY");
                    var monthsBetween = endMoment.diff(startMoment, 'months');
                    var totalTime = 24;
                    var timePerMonth = totalTime / monthsBetween;
                    for (var currentMoment = moment(startMoment); currentMoment.isBefore(endMoment); currentMoment.add(2, 'months')) {
                        (function () {
                            var citiesToDisplay = cities.filter(function (city) {
                                return city.properties.month === currentMoment.format("MM-YYYY");
                            });
                            var currentMonthsBetween = currentMoment.diff(startMoment, 'months');
                            var time = timePerMonth * currentMonthsBetween;
                            timelineDef[time] = function () {
                                var markers = [];
                                citiesToDisplay.forEach(function (city) {
                                    var marker = map.addCircleMarker(city.geometry.coordinates[1], city.geometry.coordinates[0]);
                                    markers.push(marker);
                                });
                                this.setUndo(function () {
                                    markers.forEach(function (marker) {
                                        map.leafletMap.removeLayer(marker);
                                    })
                                })
                            };
                        })();
                    }

                    Talkie.timeline("#audio-container audio", timelineDef);
                }, 500);
            }
        }
    });
})(angular);