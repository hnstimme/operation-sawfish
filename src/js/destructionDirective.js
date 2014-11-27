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
                imageBounds = [[49.12107, 9.16907], [49.17003, 9.25135]];
            return L.imageOverlay(imageUrl, imageBounds).addTo(this.leafletMap);
        }
    };

    angular.module('app').directive('destruction', function ($http) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                map.init();
                var animate = Talkie.animate(element[0]);

                var imgClasses = ['kiliansplatz', 'rathaus', 'wollhaus'];
                var imgs = [];
                imgClasses.forEach(function (imgClass) {
                    imgs[imgClass] = animate.select('.img-' + imgClass);
                });

                // TODO setTimeout is a temporary workaround
                setTimeout(function () {
                    Talkie.timeline("#audio-container audio", {
                        0.1: function () {
                            $analytics.eventTrack('playing', {
                                category: 'Heilbronn ist zerstört'
                            });
                        },
                        3: function () {
                            var layer = map.addDestructionAreas('total');
                            this.setUndo(function () {
                                map.leafletMap.removeLayer(layer);
                            });
                        },
                        10: function () {
                            var layer = map.addDestructionAreas('partial');
                            this.setUndo(function () {
                                map.leafletMap.removeLayer(layer);
                            });
                        },
                        14: imgs['kiliansplatz'].style('opacity', 1, 1000),
                        19: imgs['rathaus'].style('opacity', 1, 0).and(imgs['kiliansplatz'].style('opacity', 0, 1000)),
                        24: imgs['wollhaus'].style('opacity', 1, 0).and(imgs['rathaus'].style('opacity', 0, 1000))
                    });
                }, 500);
            }
        }
    });
})(angular);