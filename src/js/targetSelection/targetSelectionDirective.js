(function (angular) {
    'use strict';

    var map = {
        leafletMap: null,
        layers: {},
        init: function () {
            this.leafletMap = L.map('map', {
                center: [49.14, 9.22],
                zoom: 13,
                minZoom: 5,
                maxZoom: 20
            });

            this.addTileLayer();
            this.addAreas();
        },
        addTileLayer: function () {
            var attribution = '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>';
            // danielstahl.k91489gn
            L.tileLayer('https://{s}.tiles.mapbox.com/v3/danielstahl.k90gp8cm/{z}/{x}/{y}.png', {
                'maxZoom': 18,
                'attribution': attribution
            }).addTo(this.leafletMap);
        },
        addAreas: function () {
            var areas = ['areal1', 'areal2', 'areal3'];
            var that = this;
            areas.forEach(function (area) {
                var imageUrl = 'img/' + area + '.svg',
                    imageBounds = [[49.12107, 9.17307], [49.17003, 9.25135]];
                that.layers[area] = L.imageOverlay(imageUrl, imageBounds).addTo(that.leafletMap);
                that.layers[area].setOpacity(0);
            })
        }
    };

    angular.module('app').directive('targetSelection', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                map.init();

                // TODO setTimeout is a temporary workaround
                setTimeout(function () {
                    var timeline = Talkie.timeline("#ts-controls", {
                        0.2: function () {
                            map.layers['areal1'].setOpacity(1);
                            this.setUndo(function () {
                                map.layers['areal1'].setOpacity(0);
                            })
                        },
                        10.9: function () {
                            map.leafletMap.setZoom(14);
                            this.setUndo(function () {
                                map.leafletMap.setZoom(13);
                            });
                        },
                        11: function () {
                            map.layers['areal2'].setOpacity(1);
                            this.setUndo(function () {
                                map.layers['areal2'].setOpacity(0);
                            })
                        },
                        19.9: function () {
                            map.leafletMap.setZoom(15);
                            this.setUndo(function () {
                                map.leafletMap.setZoom(14);
                            });
                        },
                        20: function () {
                            map.layers['areal3'].setOpacity(1);
                            this.setUndo(function () {
                                map.layers['areal3'].setOpacity(0);
                            })
                        }
                    });
                    Talkie.ui.playButton("#ts-wrapper", timeline);
                }, 500);
            }
        }
    });
})(angular);