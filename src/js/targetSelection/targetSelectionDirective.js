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
        addArea: function (feature) {
            return L.geoJson(feature, {
                style: {
                    fillColor: feature.properties.color,
                    fillOpacity: 0,
                    opacity: 1,
                    color: '#FFFFFF',
                    weight: 2,
                    className: 'path-' + feature.properties.id
                }
            }).addTo(this.leafletMap);
        }
    };

    angular.module('app').directive('targetSelection', function ($http, $analytics) {
        return {
            restrict: 'A',
            link: function () {
                map.init();

                var features = {};
                var areas = {};
                $http.get('data/targetareas.json').success(function (geojson) {
                    geojson.features.forEach(function (feature) {
                        features[feature.properties.id] = feature;
                    });
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
                            areas['zielgebiet1'] = map.addArea(features['zielgebiet1']);
                            areas['zielgebiet2'] = map.addArea(features['zielgebiet2']);
                            new Walkway({selector: '.path-zielgebiet1', duration: '7000', easing: 'linear'}).draw();
                            new Walkway({selector: '.path-zielgebiet2', duration: '7000', easing: 'linear'}).draw();
                            this.setUndo(function () {
                                areas['zielgebiet1'].removeFrom(map.leafletMap);
                                areas['zielgebiet2'].removeFrom(map.leafletMap);
                                areas['zielgebiet1'] = null;
                                areas['zielgebiet2'] = null;
                            })
                        },
                        9.25: function () {
                            areas['zielgebiet2'].setStyle({
                                fillOpacity: 0.35
                            });
                            areas['zielgebiet1'].setStyle({
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
                                areas['brandanfaellig'].removeFrom(map.leafletMap);
                                areas['brandanfaellig'] = null;
                            });
                        },
                        22.25: function () {
                            areas['brandanfaellig'].setStyle({
                                fillOpacity: 0.35
                            });
                        }
                    });
                }, 500);
            }
        }
    });
})(angular);