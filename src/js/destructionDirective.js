(function (angular) {
    'use strict';

    var map = {
        leafletMap: null,
        layers: {},
        init: function () {
            this.leafletMap = L.map('destruction-map', {
                center: [49.145, 9.22],
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
        addMarkers: function () {

        }
    };

    angular.module('app').directive('destruction', function ($analytics) {
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

                scope.activateInteractive = function () {
                    scope.showEndscreen = false;
                    // TODO add markers
                };

                // TODO setTimeout is a temporary workaround
                setTimeout(function () {
                    Talkie.timeline("#audio-container audio", {
                        0: function () {
                            $analytics.eventTrack('playing', {
                                category: 'Heilbronn ist zerstört'
                            });
                        },
                        1.5: imgs['wollhaus'].style('opacity', 1, 300).and(imgs['luft'].style('opacity', 0, 1000)),
                        4.5: imgs['rathaus'].style('opacity', 1, 300).and(imgs['wollhaus'].style('opacity', 0, 1000)),
                        7: imgs['kiliansplatz'].style('opacity', 1, 300).and(imgs['rathaus'].style('opacity', 0, 1000)),
                        10: imgs['kiliansplatz'].style('opacity', 0, 1000).and(function () {
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
                                // TODO remove markers
                            })
                        }
                    });
                }, 500);
            }
        }
    });
})(angular);