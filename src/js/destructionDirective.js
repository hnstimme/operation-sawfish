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

                // TODO setTimeout is a temporary workaround
                setTimeout(function () {
                    Talkie.timeline("#audio-container audio", {
                        0: function () {
                            $analytics.eventTrack('playing', {
                                category: 'Heilbronn ist zerstört'
                            });
                        },
                        2: imgs['wollhaus'].style('opacity', 1, 300).and(imgs['luft'].style('opacity', 0, 1000)),
                        5: imgs['rathaus'].style('opacity', 1, 300).and(imgs['wollhaus'].style('opacity', 0, 1000)),
                        8: imgs['kiliansplatz'].style('opacity', 1, 300).and(imgs['rathaus'].style('opacity', 0, 1000)),
                        11: imgs['kiliansplatz'].style('opacity', 0, 1000).and(function () {
                            var layer = map.addDestructionAreas('total');
                            this.setUndo(function () {
                                map.leafletMap.removeLayer(layer);
                            });
                        }),
                        14: function () {
                            var layer = map.addDestructionAreas('partial');
                            this.setUndo(function () {
                                map.leafletMap.removeLayer(layer);
                            });
                        }
                    });
                }, 500);
            }
        }
    });
})(angular);