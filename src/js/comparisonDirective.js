(function (angular) {
    'use strict';

    var map = {
        leafletMap: null,
        layers: {},
        init: function () {
            this.leafletMap = L.map('comparison-map', {
                center: [51.1633, 10.4476],
                zoom: L.Browser.mobile ? 5 : 6,
                minZoom: 5,
                maxZoom: 18,
                zoomControl: !Modernizr.touch
            });
            this.addTileLayer();
            this.addLegend();
        },
        addTileLayer: function () {
            var attribution = '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>';
            // danielstahl.k91489gn
            L.tileLayer('https://{s}.tiles.mapbox.com/v3/danielstahl.k90gp8cm/{z}/{x}/{y}.png', {
                'maxZoom': 18,
                'attribution': attribution
            }).addTo(this.leafletMap);
        },
        addCircleMarker: function (city, $translate) {
            var marker = L.circleMarker(L.latLng(city.geometry.coordinates[1], city.geometry.coordinates[0]), {
                fillColor: '#FF0000',
                strokeColor: '#FF0000',
                color: '#FF0000',
                opacity: 0,
                fillOpacity: 0.3,
                radius: 10
            });
            marker.bindPopup('<p class="leaflet-popup-title">' + city.properties.name + '</p><p><span class="heaviest_attack_label">' + $translate.instant('HEAVIEST_ATTACK') + ':</span> ' + city.properties.attackDate + '</p>');
            map.leafletMap.addLayer(marker);
            return marker;
        },
        addLegend: function () {
            var legend = L.control({position: 'topright'});
            legend.onAdd = function () {
                var div = L.DomUtil.create('div', 'info legend');
                div.style.minWidth = '150px';
                div.style.display = 'none';
                div.innerHTML += '<p class="current-date"></p>';
                return div;
            };
            legend.addTo(this.leafletMap);
            return legend;
        }
    };

    angular.module('app').directive('comparison', function ($http, $analytics, $timeout, $translate, $rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                map.init();
                var animate = Talkie.animate(element[0]);

                var cities = [];
                var dataPromise = $http.get('data/cities.json').success(function (geojson) {
                    cities = geojson.features;
                });

                dataPromise.then(function () {
                    var legend = animate.select('.legend');
                    var currentDate = animate.select('.current-date');
                    var timelineDef = {};
                    var startMoment = moment("01021942", "DDMMYYYY");
                    var endMoment = moment("31051945", "DDMMYYYY");
                    var monthsBetween = endMoment.diff(startMoment, 'months');
                    var totalTime = 12;
                    var timePerMonth = totalTime / monthsBetween;
                    for (var currentMoment = moment(startMoment); currentMoment.isBefore(endMoment); currentMoment.add(1, 'months')) {
                        (function () {
                            var citiesToDisplay = cities.filter(function (city) {
                                return city.properties.attackMonth === currentMoment.format("MM-YYYY");
                            });
                            var currentMonthsBetween = currentMoment.diff(startMoment, 'months');
                            var time = timePerMonth * currentMonthsBetween;

                            timelineDef[time] = currentDate.text(currentMoment.format("MMMM YYYY")).and(function () {
                                var markers = [];
                                citiesToDisplay.forEach(function (city) {
                                    var marker = map.addCircleMarker(city, $translate);
                                    markers.push(marker);
                                });

                                this.setUndo(function () {
                                    markers.forEach(function (marker) {
                                        map.leafletMap.removeLayer(marker);
                                    })
                                })
                            });
                        })();
                    }
                    timelineDef[0.001] = legend.style('display', 'block').and(function () {
                        $analytics.eventTrack('playing', {
                            category: 'Der Luftkrieg'
                        });
                    });

                    var imgs = [];
                    ['tote', 'wiederaufbau', 'kilianskirche-west'].forEach(function (imgClass) {
                        imgs[imgClass] = animate.select('.img-' + imgClass);
                    });
                    var imgsContainer = animate.select('.imgs');
                    var swapImage = function (toShow, toHide) {
                        return imgs[toShow].style('opacity', 1, 1000).and(imgs[toHide].style('opacity', 0, 3000));
                    };

                    timelineDef[12.5] = imgsContainer.style('display', 'block');
                    timelineDef[13] = imgs['tote'].style('opacity', 1, 1000);
                    timelineDef[19] = swapImage('kilianskirche-west', 'tote');
                    timelineDef[24] = swapImage('wiederaufbau', 'kilianskirche-west');

                    timelineDef[25] = function () {
                        var promise = $timeout(function () {
                            scope.showEndscreen = true;
                        }, $translate.use() === "de" ? 4000 : 2000);
                        this.setUndo(function () {
                            $timeout.cancel(promise);
                            scope.showEndscreen = false;
                        })
                    };

                    var talkie = Talkie.timeline("#audio-container audio", timelineDef);
                    scope.$on('$destroy', function () {
                        talkie.destroy();
                    });
                });
            }
        }
    });
})(angular);