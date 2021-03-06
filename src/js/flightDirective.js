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
                center: this.views.initial.center,
                zoom: this.views.initial.zoom,
                minZoom: 4,
                maxZoom: 18,
                zoomControl: !Modernizr.touch
            });

            this.addTileLayer();
        },
        addTileLayer: function () {
            var attribution = '© <a href=\'https://www.mapbox.com/about/maps/\'>Mapbox</a> © <a href=\'http://www.openstreetmap.org/copyright\'>OpenStreetMap</a> <strong><a href=\'https://www.mapbox.com/map-feedback/\' target=\'_blank\'>Improve this map</a></strong>';
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
        addCircleMarker: function (lat, lon, id) {
            var marker = L.circleMarker(L.latLng(lat, lon), {
                fillColor: '#000000',
                className: 'circle-marker-' + id
            });
            map.leafletMap.addLayer(marker);
            return marker;
        },
        views: {
            initial: {
                center: [51.481382896100975, 5.196533203125],
                zoom: L.Browser.mobile ? 4 : 6
            },
            toInitial: function () {
                map.leafletMap.setView(map.views.initial.center, map.views.initial.zoom);
            },
            toEngland: function () {
                map.leafletMap.fitBounds([
                    [49.97982455, -6.08849263],
                    [55.0535025, 0.89881206]
                ]);
            },
            toAirports: function () {
                map.leafletMap.fitBounds([
                    [53.0477, -0.7840],
                    [53.425900839266, 0.22521972656249997]
                ]);
            },
            toReading: function () {
                map.leafletMap.fitBounds([
                    [51.39920565355378, -1.25244140625],
                    [53.425900839266, 0.22521972656249997]
                ]);
            },
            toHeilbronn: function () {
                map.leafletMap.fitBounds([
                    [48.90805939965008, -1.2744140625],
                    [53.553362785528094, 9.426269531249998]
                ]);
            }
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

    angular.module('app').directive('flight', function ($http, $timeout, $q, $translate) {
        return {
            restrict: 'A',
            link: function (scope, element) {
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
                            feature.properties.id = Math.round(Math.random() * 10);
                            airportsToReadingLines.push(feature);
                        } else {
                            readingToHnLine = feature;
                        }
                    });
                });

                var hideAirplane;
                scope.showLancasterDetails = function () {
                    d3.select('.lancaster .plane-label').transition().attr('y', 40);
                    d3.select('.lancaster-details').transition().style('opacity', 1);
                    d3.select('.lancaster').classed('in-details', true).transition().style('opacity', 1);
                    d3.select('.mosquito').style('display', 'none').style('opacity', 0);
                    $timeout(function () {
                        hideAirplane = scope.hideLancasterDetails;
                    }, 500);
                };
                scope.hideLancasterDetails = function () {
                    d3.select('.lancaster .plane-label').transition().attr('y', 70);
                    d3.select('.lancaster-details').transition().style('opacity', 0);
                    d3.select('.lancaster').classed('in-details', false);
                    d3.select('.mosquito').style('display', 'block').transition().delay(300).style('opacity', 0.6);
                    hideAirplane = null;
                };
                scope.showMosquitoDetails = function () {
                    d3.select('.mosquito .plane-label').transition().attr('y', 40);
                    d3.select('.mosquito-default-view').transition().attr('transform', 'translate(-520 0)');
                    d3.select('.mosquito-details').transition().style('opacity', 1);
                    d3.select('.mosquito').classed('in-details', true).transition().style('opacity', 1);
                    d3.select('.lancaster').style('display', 'none').style('opacity', 0);
                    $timeout(function () {
                        hideAirplane = scope.hideMosquitoDetails;
                    }, 500);
                };
                scope.hideMosquitoDetails = function () {
                    d3.select('.mosquito .plane-label').transition().attr('y', 70);
                    d3.select('.mosquito-default-view').transition().attr('transform', 'translate(0 0)');
                    d3.select('.mosquito-details').transition().style('opacity', 0);
                    d3.select('.mosquito').classed('in-details', false);
                    d3.select('.lancaster').style('display', 'block').transition().delay(300).style('opacity', 0.5);
                    hideAirplane = null;
                };

                scope.$on('escape', function () {
                    if (hideAirplane) hideAirplane();
                });

                scope.lancasterGroups = [];
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
                            'transform': 'scale(0.059) translate(' + i * 580 + ' 24701)'
                        });
                    }
                    for (var j = 0; j < groupToBuild.rows; j++) {
                        var rowId = j + groupToBuild.rowOffset;
                        scope.lancasterGroups.push({
                            'id': rowId,
                            'transform': 'translate(0 ' + rowId * 40 + ')',
                            'lancasters': group
                        });
                    }
                });

                var mosquitos = [];
                for (var j = 0; j < 5; j++) {
                    mosquitos.push({
                        id: j,
                        transform: 'translate(' + j * 32 + ' 1088)'
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

                        var lancasters = [];
                        scope.lancasterGroups.forEach(function (group) {
                            group.lancasters.forEach(function (lancaster) {
                                lancasters.push(animate.select('.lancaster-' + group.id + '-' + lancaster.id));
                            })
                        });
                        var lancasterCounter = animate.select('.lancaster-counter');
                        var timePerLancaster = opacityTime / lancasters.length;
                        shuffle(lancasters);
                        var count = 0;
                        lancasters.forEach(function (lancaster, index) {
                            count++;
                            timelineDef[index * timePerLancaster + 6] = lancaster.style('opacity', 1).attr('transform', lancaster.element.attr('transform').replace(/ 24701/, " 0"), 2000);
                            timelineDef[index * timePerLancaster + 7.201] = lancasterCounter.text(count);
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
                            timelineDef[index * timePerMosquito + 6.001] = mosquito.style('opacity', 1).attr('transform', mosquito.element.attr('transform').replace(/ 1088/, " 0"), 2500);
                            timelineDef[index * timePerMosquito + 7.502] = mosquitoCounter.text(mosquitoCount);
                        });

                        timelineDef[5] = function () {
                            element.attr('style', '');
                            this.setUndo(function () {
                                element.attr('style', 'visibility:hidden');
                            });
                        };

                        timelineDef[2] = function () {
                            map.views.toEngland();
                            this.setUndo(function () {
                                map.views.toInitial();
                            });
                        };

                        timelineDef[13] = gPlanes.style('opacity', 0, 500);
                        timelineDef[13.1] = gPlaneTypes.style('opacity', 1, 500);
                        timelineDef[18.1] = animate.select('.lancaster').style('opacity', 0.5, 500).and(animate.select('.mosquito').style('opacity', 1, 500));

                        timelineDef[21] = function () {
                            element.attr('style', 'visibility:hidden');
                            map.views.toAirports();
                            this.setUndo(function () {
                                element.attr('style', '');
                                map.views.toEngland();
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
                        timelineDef[23.5] = function () {
                            map.views.toReading();
                            this.setUndo(function () {
                                map.views.toAirports();
                            });
                        };
                        timelineDef[24] = function () {
                            var that = this;
                            var circleMarker = map.addCircleMarker(51.542919, -0.962162, 'reading');
                            var polylines = [];
                            airportsToReadingLines.forEach(function (line) {
                                var polyline = map.addPolyline(line);
                                if (!that.fast_forward) {
                                    new Walkway({
                                        selector: '.circle-marker-reading',
                                        duration: 2250,
                                        easing: 'linear'
                                    }).draw();
                                    new Walkway({
                                        selector: '.path-' + line.properties.id,
                                        duration: 2250,
                                        easing: 'linear'
                                    }).draw();
                                }
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
                            if (!this.fast_forward) {
                                new Walkway({
                                    selector: '.path-' + readingToHnLine.properties.id,
                                    duration: 10000,
                                    easing: 'linear'
                                }).draw();
                            }
                            this.setUndo(function () {
                                map.leafletMap.removeLayer(polyline);
                            });
                        };
                        timelineDef[26.5] = function () {
                            map.views.toHeilbronn();
                            this.setUndo(function () {
                                map.views.toReading();
                            });
                        };
                        timelineDef[35] = function () {
                            var circleMarker = map.addCircleMarker(49.140281, 9.188591, 'hn');
                            if (!this.fast_forward) {
                                new Walkway({selector: '.circle-marker-hn', duration: 2250, easing: 'linear'}).draw();
                            }
                            this.setUndo(function () {
                                map.leafletMap.removeLayer(circleMarker);
                            });
                        };
                        timelineDef[36.5] = function () {
                            var promise = $timeout(function () {
                                scope.showEndscreen = true;
                            }, $translate.use() === "de" ? 2000 : 3000);
                            this.setUndo(function () {
                                $timeout.cancel(promise);
                                scope.showEndscreen = false;
                            })
                        };

                        var talkie = Talkie.timeline("#audio-container audio", timelineDef);
                        scope.$on('$destroy', function () {
                            talkie.destroy();
                        });
                    }, 500);
                });
            }
        }
    });
})(angular);