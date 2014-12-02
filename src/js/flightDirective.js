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
            return L.geoJson(feature, {
                style: {
                    className: 'path-' + feature.properties.id
                }
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

    angular.module('app').directive('flight', function ($http, $analytics, $timeout, $q) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                map.init();

                var airportFeatures = [];
                var airportsPromise = $http.get('data/airports.json').success(function (geojson) {
                    airportFeatures = geojson.features;
                });
                var airportsToReadingLines = [];
                var readingToHnLine = null;
                var waypointsPromise = $http.get('data/waypoints.json').success(function (geojson) {
                    geojson.features.forEach(function (feature) {
                        if (!feature.properties.id) {
                            airportsToReadingLines.push(feature);
                        } else {
                            readingToHnLine = feature;
                        }
                    });
                });

                scope.showLancesterDetails = function () {
                    d3.select('.lancester .plane-label').transition().attr('y', 40);
                    d3.select('.lancester-details').transition().style('opacity', 1);
                    d3.select('.lancester').transition().style('opacity', 1);
                    d3.select('.mosquito').style('display', 'none').style('opacity', 0);
                };
                scope.hideLancesterDetails = function () {
                    d3.select('.lancester .plane-label').transition().attr('y', 70);
                    d3.select('.lancester-details').transition().style('opacity', 0);
                    d3.select('.mosquito').style('display', 'block').transition().delay(300).style('opacity', 0.6);
                };
                scope.showMosquitoDetails = function () {
                    d3.select('.mosquito .plane-label').transition().attr('y', 40);
                    d3.select('.mosquito-default-view').transition().attr('transform', 'translate(-520 0)');
                    d3.select('.mosquito-details').transition().style('opacity', 1);
                    d3.select('.mosquito').transition().style('opacity', 1);
                    d3.select('.lancester').style('display', 'none').style('opacity', 0);
                };
                scope.hideMosquitoDetails = function () {
                    d3.select('.mosquito .plane-label').transition().attr('y', 70);
                    d3.select('.mosquito-default-view').transition().attr('transform', 'translate(0 0)');
                    d3.select('.mosquito-details').transition().style('opacity', 0);
                    d3.select('.lancester').style('display', 'block').transition().delay(300).style('opacity', 0.5);
                };

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

                $q.all([airportsPromise, waypointsPromise]).then(function () {
                    $timeout(function () {
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

                        timelineDef[2] = function () {
                            map.leafletMap.setView([52.00366, -0.547855], 8);
                            this.setUndo(function () {
                                map.leafletMap.setView([51.481382896100975, 5.196533203125], 6);
                            });
                        };

                        timelineDef[13] = gPlanes.style('opacity', 0, 500);
                        timelineDef[13.1] = gPlaneTypes.style('opacity', 1, 500);
                        timelineDef[18.1] = animate.select('.lancester').style('opacity', 0.5, 500);
                        timelineDef[18.2] = animate.select('.mosquito').style('opacity', 1, 500);

                        timelineDef[21] = function () {
                            element.attr('style', 'visibility:hidden');
                            this.setUndo(function () {
                                element.attr('style', '');
                            });
                        };

                        // airports
                        timelineDef[21.05] = function () {
                            map.leafletMap.setView([53.186287573913305, 0.015106201171874998], 10);
                            this.setUndo(function () {
                                map.leafletMap.setView([52.00366, -0.547855], 8);
                            });
                        };
                        airportFeatures.forEach(function (feature, index) {
                            timelineDef[21.5 + 0.2 * index] = function () {
                                var marker = map.addMarker(feature);
                                this.setUndo(function () {
                                    map.leafletMap.removeLayer(marker);
                                });
                            }
                        });

                        // flight
                        timelineDef[24] = function () {
                            map.leafletMap.setView([52.315195264379575, 0], 7);
                            this.setUndo(function () {
                                map.leafletMap.setView([53.186287573913305, 0.015106201171874998], 10);
                            });
                        };
                        timelineDef[23.5] = function () {
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

                        timelineDef[27] = function () {
                            var polyline = map.addPolyline(readingToHnLine);
                            this.setUndo(function () {
                                map.leafletMap.removeLayer(polyline);
                            });
                        };
                        timelineDef[26.5] = function () {
                            map.leafletMap.setView([51.42661449707482, 4.2626953125], 6);
                            this.setUndo(function () {
                                map.leafletMap.setView([52.315195264379575, 0], 7);
                            });
                        };
                        timelineDef[36] = function () {
                            var circleMarker = map.addCircleMarker(49.140281, 9.188591);
                            this.setUndo(function () {
                                map.leafletMap.removeLayer(circleMarker);
                            });
                        };
                        timelineDef[36.5] = function () {
                            var promise = $timeout(function () {
                                scope.showEndscreen = true;
                            }, 2000);
                            this.setUndo(function () {
                                $timeout.cancel(promise);
                                scope.showEndscreen = false;
                            })
                        };

                        timelineDef[0.1] = function () {
                            $analytics.eventTrack('playing', {
                                category: 'Der Anflug'
                            });
                        };

                        var talkie = Talkie.timeline("#audio-container audio", timelineDef);
                        scope.$on('$destroy', function () {
                            talkie.destroy();
                        });
                    });
                });
            }
        }
    });
})(angular);