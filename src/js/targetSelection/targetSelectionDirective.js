(function (angular) {
    'use strict';

    var map = {
        leafletMap: null,
        layers: {},
        init: function () {
            this.leafletMap = L.map('map', {
                center: [49.145, 9.22],
                zoom: 14,
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
        addImageLayer: function () {
            var imageUrl = 'img/hn-1944.png',
                imageBounds = [[49.12107, 9.16907], [49.17003, 9.25135]];
            L.imageOverlay(imageUrl, imageBounds).addTo(this.leafletMap);
        },
        addLegend: function (features) {
            var legend = L.control({position: 'topright'});
            legend.onAdd = function () {
                var div = L.DomUtil.create('div', 'info legend');
                div.innerHTML += '<p class="legend-intro">Heilbronn geriet 1944 für einen Flächenangriff ins Visier der Royal Air Force.</p>';
                features.forEach(function (feature) {
                    div.innerHTML += '<p class="legend-entry"><span class="legend-color" style="background:' + feature.properties.color + '"></span> ' + feature.properties.label + '</p>';
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

    angular.module('app').directive('targetSelection', function ($http, $analytics) {
        return {
            restrict: 'A',
            link: function (scope) {
                map.init();

                var features = {};
                var areas = {};
                $http.get('data/targetareas.json').success(function (geojson) {
                    geojson.features.forEach(function (feature) {
                        features[feature.properties.id] = feature;
                    });
                    map.addLegend(geojson.features);
                });

                // TODO setTimeout is a temporary workaround
                setTimeout(function () {
                    Talkie.timeline("#audio-container audio", {
                        0.1: function () {
                            $analytics.eventTrack('playing', {
                                category: 'Der Plan'
                            });
                        },
                        2: function () {
                            areas['zielgebiet'] = map.addArea(features['zielgebiet']);
                            new Walkway({selector: '.path-zielgebiet', duration: '7000', easing: 'linear'}).draw();
                            this.setUndo(function () {
                                map.leafletMap.removeLayer(areas['zielgebiet']);
                                areas['zielgebiet'] = null;
                            })
                        },
                        9.25: function () {
                            areas['zielgebiet'].setStyle({
                                fillOpacity: 0.35
                            });
                        },
                        13: function () {
                            map.leafletMap.setZoom(15);
                            this.setUndo(function () {
                                map.leafletMap.setZoom(14);
                            });
                        },
                        15: function () {
                            areas['brandanfaellig'] = map.addArea(features['brandanfaellig']);
                            new Walkway({selector: '.path-brandanfaellig', duration: '7000', easing: 'linear'}).draw();
                            this.setUndo(function () {
                                map.leafletMap.removeLayer(areas['brandanfaellig']);
                                areas['brandanfaellig'] = null;
                            });
                        },
                        22.25: function () {
                            areas['brandanfaellig'].setStyle({
                                fillOpacity: 0.35
                            });
                        },
                        33: function () {
                            scope.showEndscreen = true;
                            this.setUndo(function () {
                                scope.showEndscreen = false;
                            })
                        }
                    });
                }, 500);
            }
        }
    });
})(angular);