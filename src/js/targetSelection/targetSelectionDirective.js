(function (angular) {
    'use strict';

    var map = {
        leafletMap: null,
        init: function () {
            this.leafletMap = L.map('map', {
                center: [50.665691, 10.451526],
                zoom: 7,
                minZoom: 5,
                maxZoom: 12
            });

            this.addTileLayer();
        },
        addTileLayer: function () {
            var attribution = '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>';
            L.tileLayer('https://{s}.tiles.mapbox.com/v3/pascalgabriel.k28h1mih/{z}/{x}/{y}.png', {
                'maxZoom': 18,
                'attribution': attribution
            }).addTo(this.leafletMap);
        }
    };

    angular.module('app').directive('targetSelection', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                map.init();
            }
        }
    });
})(angular);