(function (angular) {
    'use strict';
    var map = {
        leafletMap: null,
        layers: {},
        init: function () {
            this.leafletMap = L.map('flight-map', {
                center: [51.481382896100975, 5.196533203125],
                zoom: 6,
                minZoom: 5,
                maxZoom: 20
            });

            this.addTileLayer();
        },
        addTileLayer: function () {
            var attribution = '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>';
            L.tileLayer('https://{s}.tiles.mapbox.com/v3/danielstahl.k91489gn/{z}/{x}/{y}.png', {
                'maxZoom': 18,
                'attribution': attribution
            }).addTo(this.leafletMap);
        }
    };

    angular.module('app').directive('flight', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                map.init();

                scope.lancesterGroups = [];
                var lancesterGroup = [];
                for (var i = 0; i < 22; i++) {
                    lancesterGroup.push({
                        'id': i,
                        'transform': 'scale(0.06) translate(' + i * 580 + ' 0)'
                    });
                }
                for (var i = 0; i <= 13; i++) {
                    scope.lancesterGroups.push({
                        'id': i,
                        'transform': 'translate(0 ' + i * 40 + ')',
                        'lancesters': lancesterGroup
                    });
                }

                var svg = element[0],
                    animate = Talkie.animate(svg);

                // TODO setTimeout is a temporary workaround
                setTimeout(function () {
                    var lancesterGroups = animate.select('.lancester-groups');

                    var timeline = Talkie.timeline("#a-controls", {
                        2: lancesterGroups.attr('transform', 'translate(0 0)', 2000)
                    });
                    Talkie.ui.playButton("#a-wrapper", timeline);
                }, 500);
            }
        }
    });
})(angular);