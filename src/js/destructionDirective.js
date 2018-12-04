(function (angular) {
    'use strict';

    var legendEntries = [{
        id: 'total',
        color: '#880717',
        label: 'TOTAL_DESTRUCTION'
    }, {
        id: 'partial',
        color: '#FD938A',
        label: 'PARTIAL_DESTRUCTION'
    }];

    var map = {
        leafletMap: null,
        init: function () {
            L.Icon.Default.imagePath = 'bower_components/leaflet/dist/images';
            this.leafletMap = L.map('destruction-map', {
                center: [49.1423, 9.2188],
                zoom: 14,
                minZoom: 5,
                maxZoom: 18,
                zoomControl: !Modernizr.touch
            });

            this.addTileLayer();
        },
        addTileLayer: function () {
            var attribution = '© <a href=\'https://www.mapbox.com/about/maps/\'>Mapbox</a> © <a href=\'http://www.openstreetmap.org/copyright\'>OpenStreetMap</a> <strong><a href=\'https://www.mapbox.com/map-feedback/\' target=\'_blank\'>Improve this map</a></strong>';
            // danielstahl.k91489gn
            L.tileLayer('https://{s}.tiles.mapbox.com/v3/danielstahl.k90gp8cm/{z}/{x}/{y}.png', {
                'maxZoom': 18,
                'attribution': attribution
            }).addTo(this.leafletMap);
        },
        addDestructionAreas: function (id) {
            var imageUrl = 'img/destruction_areas_' + id + '.png',
                imageBounds = [[49.12616111111112, 9.186772222222222], [49.16519166666667, 9.246605555555554]];
            return L.imageOverlay(imageUrl, imageBounds, {
                opacity: 0.75
            }).addTo(this.leafletMap);
        },
        addLegend: function (layers, $translate) {
            var legend = L.control({position: 'topright'});
            legend.onAdd = function () {
                var div = L.DomUtil.create('div', 'info legend');
                div.style.opacity = 0;
                div.style.minWidth = '150px';
                layers.forEach(function (layer) {
                    div.innerHTML += '<div class="legend-entry legend-entry-' + layer.id + '" style="display:none;opacity:0"><span class="legend-color" style="background:' + layer.color + '"></span><span class="legend-label">' + $translate.instant(layer.label) + '</span></div>';
                });
                return div;
            };
            legend.addTo(this.leafletMap);
            return legend;
        },
        addMarkers: function (geojson, cb) {
            return L.geoJson(geojson.features, {
                pointToLayer: function (feature, latLng) {
                    return L.circleMarker(L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]), {
                        fillColor: '#2E71CC',
                        fillOpacity: 1,
                        weight: 4,
                        color: '#FFFFFF'
                    });
                },
                onEachFeature: function (feature, layer) {
                    layer.on('click', cb)
                }
            }).addTo(this.leafletMap);
        }
    };

    angular.module('app').directive('destruction', function ($http, $timeout, $rootScope, $translate) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                map.init();
                map.addLegend(legendEntries, $translate);
                var animate = Talkie.animate(element[0]);

                var imgClasses = ['kiliansplatz', 'wollhaus', 'rathaus', 'luft'];
                var imgs = [];
                imgClasses.forEach(function (imgClass) {
                    imgs[imgClass] = animate.select('.img-' + imgClass);
                });
                var imgsContainer = animate.select('.imgs');

                var imagesOfDestructionGeojson;
                var dataPromise = $http.get('data/imagesOfDestruction.json').success(function (geojson) {
                    imagesOfDestructionGeojson = geojson;
                });

                var updateLegend = function () {
                    legendEntries.forEach(function (legendEntry) {
                        document.getElementsByClassName('legend-entry-' + legendEntry.id)[0].getElementsByClassName('legend-label')[0].innerHTML = $translate.instant(legendEntry.label);
                    });
                };
                var destroyListener = $rootScope.$on('$translateChangeSuccess', updateLegend);

                var imgDate = moment();
                var showImg = function (event) {
                    scope.$apply(function () {
                        imgDate = moment();
                        scope.img = event.target.feature.properties.img;
                        scope.imgDesc = event.target.feature.properties.description;
                    });
                };

                var markerLayer;
                scope.activateInteractive = function () {
                    scope.showEndscreen = false;
                    map.leafletMap.setZoom(16);
                    markerLayer = map.addMarkers(imagesOfDestructionGeojson, showImg);
                };
                scope.hideImg = function () {
                    scope.img = null;
                };

                scope.$on('escape', function () {
                    if (moment().diff(imgDate) >= 1000) {
                        scope.$apply(scope.hideImg);
                    }
                });

                dataPromise.then(function () {
                    var swapImage = function (toShow, toHide) {
                        return imgs[toShow].style('opacity', 1, 300).and(imgs[toHide].style('opacity', 0, 1000));
                    };

                    var talkie = Talkie.timeline("#audio-container audio", {
                        1.5: swapImage('wollhaus', 'luft'),
                        4.5: swapImage('rathaus', 'wollhaus'),
                        7: swapImage('kiliansplatz', 'rathaus'),
                        9: imgs['kiliansplatz'].style('opacity', 0, 1000).and(function () {
                            var layer = map.addDestructionAreas('total');
                            d3.selectAll('.legend, .legend-entry-total').style('display', 'block').transition().duration(2000).style('opacity', 1);
                            this.setUndo(function () {
                                map.leafletMap.removeLayer(layer);
                                d3.selectAll('.legend, .legend-entry-total').style('display', 'none').style('opacity', 0);
                            });
                        }),
                        10: imgsContainer.style('display', 'none'),
                        14: function () {
                            var layer = map.addDestructionAreas('partial');
                            d3.selectAll('.legend, .legend-entry-partial').style('display', 'block').transition().duration(2000).style('opacity', 1);
                            this.setUndo(function () {
                                map.leafletMap.removeLayer(layer);
                                d3.selectAll('.legend, .legend-entry-partial').style('display', 'none').style('opacity', 0);
                            });
                        },
                        21: function () {
                            var promise = $timeout(function () {
                                scope.showEndscreen = true;
                            }, $translate.use() === "de" ? 2000 : 7000);
                            this.setUndo(function () {
                                $timeout.cancel(promise);
                                scope.showEndscreen = false;
                                scope.img = null;
                                if (markerLayer) {
                                    map.leafletMap.setZoom(13);
                                    map.leafletMap.removeLayer(markerLayer);
                                }
                            });
                        }
                    });
                    scope.$on('$destroy', function () {
                        talkie.destroy();
                        destroyListener();
                    });
                });
            }
        }
    });
})(angular);