(function (angular) {
    'use strict';
    var airportIcon = L.icon({
        iconUrl: 'img/06_Markierung_Flugplatz.png',
        iconSize: [30, 41],
        iconAnchor: [15, 41],
        popupAnchor: [-3, -76]
    });

    var map = {
        leafletMap: null,
        layers: {},
        init: function () {
            this.leafletMap = L.map('flight-map', {
                center: [51.481382896100975, 5.196533203125],
                zoom: 6,
                minZoom: 5,
                maxZoom: 20
            });

            this.addTileLayer();
        },
        addTileLayer: function () {
            var attribution = '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>';
            L.tileLayer('https://{s}.tiles.mapbox.com/v3/danielstahl.k90gp8cm/{z}/{x}/{y}.png', {
                'maxZoom': 18,
                'attribution': attribution
            }).addTo(this.leafletMap);
        },
        addMarker: function (feature) {
            return L.geoJson(feature, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {icon: airportIcon});
                }
            }).addTo(this.leafletMap);
        },
        addPolyline: function (feature) {
            return L.geoJson(feature).addTo(this.leafletMap);
        },
        addCircleMarker: function (lat, lon) {
            var marker = L.circleMarker(L.latLng(lat, lon), {
                fillColor: '#000000'
            });
            map.leafletMap.addLayer(marker);
            return marker;
        }
    };

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    angular.module('app').directive('flight', function ($http) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                map.init();

                var airportFeatures = [];
                $http.get('data/airports.json').success(function (geojson) {
                    airportFeatures = geojson.features;
                });
                var airportsToReadingLines = [];
                var readingToHnLine = null;
                $http.get('data/waypoints.json').success(function (geojson) {
                    geojson.features.forEach(function (feature) {
                        if (!feature.properties.id) {
                            airportsToReadingLines.push(feature);
                        } else {
                            readingToHnLine = feature;
                        }
                    });
                });

                scope.lancesterGroups = [];
                var groupsToBuild = [{
                    columns: 27,
                    rowOffset: 0,
                    rows: 8
                }, {
                    columns: 18,
                    rowOffset: 8,
                    rows: 2
                }, {
                    columns: 10,
                    rowOffset: 10,
                    rows: 3
                }];
                groupsToBuild.forEach(function (groupToBuild) {
                    var group = [];
                    for (var i = 0; i < groupToBuild.columns; i++) {
                        group.push({
                            'id': i,
                            'transform': 'scale(0.06) translate(' + i * 580 + ' 8701)'
                        });
                    }
                    for (var i = 0; i < groupToBuild.rows; i++) {
                        var rowId = i + groupToBuild.rowOffset;
                        scope.lancesterGroups.push({
                            'id': rowId,
                            'transform': 'translate(0 ' + rowId * 40 + ')',
                            'lancesters': group
                        });
                    }
                });

                var mosquitos = [];
                for (var j = 0; j < 5; j++) {
                    mosquitos.push({
                        id: j,
                        transform: 'translate(' + j * 32 + ' 188)'
                    })
                }
                scope.mosquitoGroups = [];
                for (var i = 0; i < 2; i++) {
                    scope.mosquitoGroups.push({
                        id: i,
                        transform: 'translate(0 ' + i * 30 + ')',
                        mosquitos: mosquitos
                    })
                }

                var svg = element[0],
                    animate = Talkie.animate(svg);

                // TODO setTimeout is a temporary workaround
                setTimeout(function () {
                    var timelineDef = {};
                    var opacityTime = 4;

                    var gPlanes = animate.select('.planes');
                    var gPlaneTypes = animate.select('.plane-types');

                    var lancesters = [];
                    scope.lancesterGroups.forEach(function (group) {
                        group.lancesters.forEach(function (lancester) {
                            lancesters.push(animate.select('.lancester-' + group.id + '-' + lancester.id));
                        })
                    });
                    var lancesterCounter = animate.select('.lancester-counter');
                    var timePerLancester = opacityTime / lancesters.length;
                    shuffle(lancesters);
                    var count = 0;
                    lancesters.forEach(function (lancester, index) {
                        count++;
                        timelineDef[index * timePerLancester + 6] = lancester.attr('transform', lancester.element.attr('transform').replace(/ 8701/, " 0"), 2000);
                        timelineDef[index * timePerLancester + 7.201] = lancesterCounter.text(count);
                    });

                    var mosquitos = [];
                    scope.mosquitoGroups.forEach(function (group) {
                        group.mosquitos.forEach(function (mosquito) {
                            mosquitos.push(animate.select('.mosquito-' + group.id + '-' + mosquito.id));
                        })
                    });
                    var mosquitoCounter = animate.select('.mosquito-counter');
                    var timePerMosquito = opacityTime / mosquitos.length;
                    shuffle(mosquitos);
                    var mosquitoCount = 0;
                    mosquitos.forEach(function (mosquito, index) {
                        mosquitoCount++;
                        timelineDef[index * timePerMosquito + 6.001] = mosquito.attr('transform', mosquito.element.attr('transform').replace(/ 188/, " 0"), 2500);
                        timelineDef[index * timePerMosquito + 7.502] = mosquitoCounter.text(mosquitoCount);
                    });

                    timelineDef[5] = function () {
                        element.attr('style', '');
                        this.setUndo(function () {
                            element.attr('style', 'visibility:hidden');
                        });
                    };

                    timelineDef[2.5] = function () {
                        map.leafletMap.setView([52.00366, -0.547855], 8);
                        this.setUndo(function () {
                            map.leafletMap.setView([51.481382896100975, 5.196533203125], 6);
                        });
                    };

                    timelineDef[13] = gPlanes.style('opacity', 0, 500);
                    timelineDef[13.1] = gPlaneTypes.style('opacity', 1, 500);
                    timelineDef[21.5] = animate.select('.lancester').style('opacity', 0.5, 500);
                    timelineDef[21.6] = animate.select('.mosquito').style('opacity', 1, 500);

                    timelineDef[27] = function () {
                        element.attr('style', 'visibility:hidden');
                        this.setUndo(function () {
                            element.attr('style', '');
                        });
                    };

                    // airports
                    timelineDef[27.05] = function () {
                        map.leafletMap.setView([53.186287573913305, 0.015106201171874998], 10);
                        this.setUndo(function () {
                            map.leafletMap.setView([52.00366, -0.547855], 8);
                        });
                    };
                    airportFeatures.forEach(function (feature, index) {
                        timelineDef[27.5 + 0.2 * index] = function () {
                            var marker = map.addMarker(feature);
                            this.setUndo(function () {
                                map.leafletMap.removeLayer(marker);
                            });
                        }
                    });

                    // flight
                    timelineDef[30] = function () {
                        map.leafletMap.setView([52.315195264379575, 0], 7);
                        this.setUndo(function () {
                            map.leafletMap.setView([53.186287573913305, 0.015106201171874998], 10);
                        });
                    };
                    timelineDef[29.5] = function () {
                        var circleMarker = map.addCircleMarker(51.542919, -0.962162);
                        var polylines = [];
                        airportsToReadingLines.forEach(function (line) {
                            var polyline = map.addPolyline(line);
                            polylines.push(polyline);
                        });
                        this.setUndo(function () {
                            polylines.forEach(function (polyline) {
                                map.leafletMap.removeLayer(polyline);
                            });
                            map.leafletMap.removeLayer(circleMarker);
                        });
                    };

                    timelineDef[34.5] = function () {
                        var polyline = map.addPolyline(readingToHnLine);
                        this.setUndo(function () {
                            map.leafletMap.removeLayer(polyline);
                        });
                    };
                    timelineDef[36] = function () {
                        map.leafletMap.setView([51.42661449707482, 4.2626953125], 6);
                        this.setUndo(function () {
                            map.leafletMap.setView([52.315195264379575, 0], 7);
                        });
                    };
                    timelineDef[44] = function () {
                        var circleMarker = map.addCircleMarker(49.140281, 9.188591);
                        this.setUndo(function () {
                            map.leafletMap.removeLayer(circleMarker);
                        });
                    };

                    Talkie.timeline("#audio-container audio", timelineDef);
                }, 500);
            }
        }
    });
})(angular);