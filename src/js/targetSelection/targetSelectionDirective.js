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
                div.style.minWidth = '300px';
                div.innerHTML += '<p class="legend-intro" style="display:none">Heilbronn geriet 1944 für einen Flächenangriff ins Visier der Royal Air Force.</p>';
                features.forEach(function (feature) {
                    div.innerHTML += '<p class="legend-entry legend-entry-' + feature.properties.id + '" style="display:none;opacity:0"><span class="legend-color" style="background:' + feature.properties.color + '"></span> ' + feature.properties.label + '</p>';
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
                        2.5: function () {
                            areas['zielgebiet-stadt'] = map.addArea(features['zielgebiet-stadt']);
                            new Walkway({
                                selector: '.path-zielgebiet-stadt',
                                duration: '4500',
                                easing: 'linear'
                            }).draw();
                            this.setUndo(function () {
                                map.leafletMap.removeLayer(areas['zielgebiet-stadt']);
                                areas['zielgebiet-stadt'] = null;
                            })
                        },
                        7.25: function () {
                            areas['zielgebiet-boeckingen'] = map.addArea(features['zielgebiet-boeckingen']);
                            new Walkway({
                                selector: '.path-zielgebiet-boeckingen',
                                duration: '4500',
                                easing: 'linear'
                            }).draw();
                            this.setUndo(function () {
                                map.leafletMap.removeLayer(areas['zielgebiet-boeckingen']);
                                areas['zielgebiet-boeckingen'] = null;
                            })
                        },
                        7: function () {
                            areas['zielgebiet-stadt'].setStyle({
                                fillOpacity: 0.35
                            });
                            d3.selectAll('.legend, .legend-entry-zielgebiet-stadt').style('display', 'block').transition().duration(1000).style('opacity', 1);
                            this.setUndo(function () {
                                d3.selectAll('.legend, .legend-entry-zielgebiet-stadt').style('display', 'none').style('opacity', 0);
                            });
                        },
                        11.75: function () {
                            areas['zielgebiet-boeckingen'].setStyle({
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
                            d3.selectAll('.legend-entry-brandanfaellig').style('display', 'block').transition().duration(1000).style('opacity', 1);
                            this.setUndo(function () {
                                d3.selectAll('.legend-entry-brandanfaellig').style('display', 'none').style('opacity', 0);
                            });
                        },
                        26.5: function () {
                            scope.showEndscreen = true;
                            d3.select('.legend-intro').style('display', 'block');
                            this.setUndo(function () {
                                scope.showEndscreen = false;
                                d3.select('.legend-intro').style('display', 'none');
                            })
                        }
                    });
                }, 500);
            }
        }
    });
})(angular);