(function (angular) {
    'use strict';

    var map = {
        leafletMap: null,
        init: function () {
            L.Icon.Default.imagePath = 'bower_components/leaflet/dist/images';
            this.leafletMap = L.map('destruction-map', {
                center: [49.1423, 9.2188],
                zoom: 13,
                minZoom: 5,
                maxZoom: 18
            });

            this.addLegend([{
                id: 'total',
                color: '#880717',
                label: 'Totalschaden'
            }, {
                id: 'partial',
                color: '#FD938A',
                label: 'Teilschaden'
            }]);
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
        addDestructionAreas: function (id) {
            var imageUrl = 'img/destruction_areas_' + id + '.png',
                imageBounds = [[49.12616111111112, 9.186772222222222], [49.16519166666667, 9.246605555555554]];
            return L.imageOverlay(imageUrl, imageBounds).addTo(this.leafletMap);
        },
        addLegend: function (layers) {
            var legend = L.control({position: 'topright'});
            legend.onAdd = function () {
                var div = L.DomUtil.create('div', 'info legend');
                div.style.opacity = 0;
                div.style.minWidth = '150px';
                layers.forEach(function (layer) {
                    div.innerHTML += '<p class="legend-entry legend-entry-' + layer.id + '" style="display:none;opacity:0"><span class="legend-color" style="opacity:1;background:' + layer.color + '"></span> ' + layer.label + '</p>';
                });
                return div;
            };
            legend.addTo(this.leafletMap);
            return legend;
        },
        addMarkers: function (geojson, cb) {
            return L.geoJson(geojson.features, {
                onEachFeature: function (feature, layer) {
                    layer.on('click', cb)
                }
            }).addTo(this.leafletMap);
        }
    };

    angular.module('app').directive('destruction', function ($analytics, $http) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                map.init();
                var animate = Talkie.animate(element[0]);

                var imgClasses = ['kiliansplatz', 'wollhaus', 'rathaus', 'luft'];
                var imgs = [];
                imgClasses.forEach(function (imgClass) {
                    imgs[imgClass] = animate.select('.img-' + imgClass);
                });
                var imgsContainer = animate.select('.imgs');

                var imagesOfDestructionGeojson;
                $http.get('/data/imagesOfDestruction.json').success(function (geojson) {
                    imagesOfDestructionGeojson = geojson;
                });

                angular.element(document.getElementsByTagName('html')[0]).bind("keyup", function (event) {
                    if (event.which === 27) {
                        scope.$apply(function () {
                            scope.hideImg();
                        });
                    }
                });

                var showImg = function (event) {
                    scope.$apply(function () {
                        scope.img = event.target.feature.properties.img;
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

                // TODO setTimeout is a temporary workaround
                setTimeout(function () {
                    var swapImage = function (toShow, toHide) {
                        return imgs[toShow].style('opacity', 1, 300).and(imgs[toHide].style('opacity', 0, 1000));
                    };

                    Talkie.timeline("#audio-container audio", {
                        0: function () {
                            $analytics.eventTrack('playing', {
                                category: 'Heilbronn ist zerstört'
                            });
                        },
                        1.5: swapImage('wollhaus', 'luft'),
                        4.5: swapImage('rathaus', 'wollhaus'),
                        7: swapImage('kiliansplatz', 'rathaus'),
                        10: imgs['kiliansplatz'].style('opacity', 0).and(imgsContainer.style('display', 'none')).and(function () {
                            var layer = map.addDestructionAreas('total');
                            d3.selectAll('.legend, .legend-entry-total').style('display', 'block').transition().duration(2000).style('opacity', 1);
                            this.setUndo(function () {
                                map.leafletMap.removeLayer(layer);
                                d3.selectAll('.legend, .legend-entry-total').style('display', 'none').style('opacity', 0);
                            });
                        }),
                        14: function () {
                            var layer = map.addDestructionAreas('partial');
                            d3.selectAll('.legend, .legend-entry-partial').style('display', 'block').transition().duration(2000).style('opacity', 1);
                            this.setUndo(function () {
                                map.leafletMap.removeLayer(layer);
                                d3.selectAll('.legend, .legend-entry-partial').style('display', 'none').style('opacity', 0);
                            });
                        },
                        21: function () {
                            scope.showEndscreen = true;
                            this.setUndo(function () {
                                scope.showEndscreen = false;
                                scope.img = null;
                                if (markerLayer) {
                                    map.leafletMap.setZoom(13);
                                    map.leafletMap.removeLayer(markerLayer);
                                }
                            })
                        }
                    });
                }, 500);
            }
        }
    });
})(angular);