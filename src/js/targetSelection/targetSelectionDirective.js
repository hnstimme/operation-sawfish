(function (angular) {
    'use strict';

    var map = {
        leafletMap: null,
        init: function () {
            this.leafletMap = L.map('map', {
                center: [49.14, 9.22],
                zoom: 12,
                minZoom: 5,
                maxZoom: 20
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
        addImageLayer: function () {
            var imageUrl = 'img/hn-1944.jpg',
                imageBounds = [[49.11028727420634, 9.131011962890625], [49.24517269137362, 9.306106567382812]];
            L.imageOverlay(imageUrl, imageBounds).addTo(this.leafletMap);
        }
    };

    angular.module('app').directive('targetSelection', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                map.init();

                // TODO setTimeout is a temporary workaround
                setTimeout(function () {
                    var animate = Talkie.animate(element[0]);

                    var timeline = Talkie.timeline("#ts-controls", {
                        5: function () {
                            map.addImageLayer();
                        }
                    });
                    Talkie.ui.playButton("#ts-wrapper", timeline);
                }, 500);
            }
        }
    });
})(angular);