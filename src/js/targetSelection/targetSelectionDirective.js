(function (angular) {
    'use strict';

    var map = {
        leafletMap: null,
        init: function (element) {
            this.leafletMap = L.map(element, {
                center: [49.145, 9.22],
                zoom: 12,
                minZoom: 8,
                maxZoom: 18,
                zoomControl: !Modernizr.touch
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
        addLegend: function (features) {
            var legend = L.control({position: 'topright'});
            legend.onAdd = function () {
                var div = L.DomUtil.create('div', 'info legend');
                div.style.opacity = 0;
                div.style.width = '230px';
                div.innerHTML += '<p class="legend-intro" style="display:none">Heilbronn geriet 1944 für einen Flächenangriff ins Visier der Royal Air Force.</p>';
                features.forEach(function (feature) {
                    div.innerHTML += '<div class="legend-entry legend-entry-' + feature.properties.id + '" style="display:none;opacity:0"><span class="legend-color" style="background:' + feature.properties.color + '"></span><span class="legend-label">' + feature.properties.label + '</span></div>';
                });
                return div;
            };
            legend.addTo(this.leafletMap);
            return legend;
        },
        addArea: function (feature) {
            return L.geoJson(feature, {
                style: {
                    fillColor: feature.properties.color,
                    fillOpacity: 0,
                    opacity: 1,
                    color: '#FFFFFF',
                    weight: 2,
                    className: 'path-' + feature.properties.id
                },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup('<p class="leaflet-popup-title">' + feature.properties.label + '</p><p>' + feature.properties.description + '</p>');
                }
            }).addTo(this.leafletMap);
        }
    };

    angular.module('app').directive('targetSelection', function ($http, $analytics, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                map.init(element[0]);

                scope.activateInteractive = function () {
                    scope.showEndscreen = false;
                    d3.select('.legend-intro').style('display', 'block');
                };

                var features = {}, areas = {};
                $http.get('data/targetareas.json').success(function (geojson) {
                    geojson.features.forEach(function (feature) {
                        features[feature.properties.id] = feature;
                    });
                    map.addLegend(geojson.features);

                    var animate = Talkie.animate(element[0]);
                    var legend = animate.select('.legend');
                    var legendEntries = {
                        'zielgebiet-stadt': animate.select('.legend-entry-zielgebiet-stadt'),
                        'brandanfaellig': animate.select('.legend-entry-brandanfaellig')
                    };

                    var addArea = function (id, duration) {
                        return function () {
                            areas[id] = map.addArea(features[id]);
                            if (!this.fast_forward) {
                                new Walkway({selector: '.path-' + id, duration: duration, easing: 'linear'}).draw();
                            }
                            this.setUndo(function () {
                                map.leafletMap.removeLayer(areas[id]);
                            })
                        }
                    };

                    var fillArea = function (id) {
                        return function () {
                            areas[id].setStyle({fillOpacity: 0.35});
                            this.setUndo(function () {
                                areas[id].setStyle({fillOpacity: 0});
                            });
                        }
                    };

                    var fadeInLegendEntry = function (id) {
                        return legendEntries[id].style('display', 'block').style('opacity', 1, 1000);
                    };

                    var fitBoundsOuter = function () {
                        map.leafletMap.fitBounds([
                            [49.12705572350681, 9.185643196105957],
                            [49.15347488527833, 9.2340087890625]
                        ]);
                    };
                    var fitBoundsInner = function () {
                        map.leafletMap.fitBounds([
                            [49.13820346350291, 9.20401096343994],
                            [49.148506575262644, 9.228086471557617]
                        ]);
                    };

                    var talkie = Talkie.timeline("#audio-container audio", {
                        0: function () {
                            fitBoundsOuter();
                            $analytics.eventTrack('playing', {
                                category: 'Der Plan'
                            });
                        },
                        2.5: addArea('zielgebiet-stadt', 4500),
                        7.25: addArea('zielgebiet-boeckingen', 4500),
                        7: legend.style({
                            display: 'block',
                            opacity: 1
                        }).and(fadeInLegendEntry('zielgebiet-stadt')).and(fillArea('zielgebiet-stadt')),
                        11.75: fillArea('zielgebiet-boeckingen'),
                        13: function () {
                            fitBoundsInner();
                            this.setUndo(function () {
                                fitBoundsOuter();
                            });
                        },
                        15: addArea('brandanfaellig', 7000),
                        22.25: fadeInLegendEntry('brandanfaellig').and(fillArea('brandanfaellig')),
                        26.5: function () {
                            var promise = $timeout(function () {
                                scope.showEndscreen = true;
                            }, 2000);
                            this.setUndo(function () {
                                $timeout.cancel(promise);
                                scope.showEndscreen = false;
                                d3.select('.legend-intro').style('display', 'none');
                            });
                        }
                    });

                    scope.$on('$destroy', function () {
                        talkie.destroy();
                    })
                });
            }
        }
    });
})(angular);