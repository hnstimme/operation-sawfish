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
            var attribution = '© <a href=\'https://www.mapbox.com/about/maps/\'>Mapbox</a> © <a href=\'http://www.openstreetmap.org/copyright\'>OpenStreetMap</a> <strong><a href=\'https://www.mapbox.com/map-feedback/\' target=\'_blank\'>Improve this map</a></strong>';
            // danielstahl.k91489gn
            L.tileLayer('https://{s}.tiles.mapbox.com/v3/danielstahl.k90gp8cm/{z}/{x}/{y}.png', {
                'maxZoom': 18,
                'attribution': attribution
            }).addTo(this.leafletMap);
        },
        getCircleMarker: function (city, $translate) {
            var marker = L.circleMarker(L.latLng(city.geometry.coordinates[1], city.geometry.coordinates[0]), {
                fillColor: '#FF0000',
                weight: 0,
                fillOpacity: 0.3,
                radius: 10
            });
            marker.bindPopup('<p class="leaflet-popup-title">' + city.properties.name + '</p><p><span class="heaviest_attack_label">' + $translate.instant('HEAVIEST_ATTACK') + ':</span> ' + city.properties.attackDate + '</p>');
            return marker;
        },
        addLegend: function () {
            var legend = L.control({position: 'topright'});
            legend.onAdd = function () {
                var div = L.DomUtil.create('div', 'info legend');
                div.style.minWidth = '150px';
                div.style.display = 'none';
                div.innerHTML += '<p class="legend-title"></p>';
                div.innerHTML += '<ul class="legend-slider-labels"><li>1942</li><li>1943</li><li>1944</li><li>1945</li></ul>';
                div.innerHTML += '<input type="range" min="1" max="48" value="2" class="legend-slider">';
                return div;
            };
            legend.addTo(this.leafletMap);
            return legend;
        }
    };

    angular.module('app').directive('comparison', function ($http, $timeout, $translate, $rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                map.init();
                var animate = Talkie.animate(element[0]);

                var cities = [];
                var dataPromise = $http.get('data/cities.json').success(function (geojson) {
                    cities = geojson.features;
                });

                var updateLegend = function () {
                    document.getElementsByClassName('legend-title')[0].innerHTML = $translate.instant('COMPARISON_LEGEND_TITLE');
                };
                updateLegend();
                var destroyListener = $rootScope.$on('$translateChangeSuccess', updateLegend);

                dataPromise.then(function () {
                    var legend = animate.select('.legend');
                    var slider = d3.select('.legend-slider');
                    var timelineDef = {};
                    var startMoment = moment("30011942", "DDMMYYYY");
                    var endMoment = moment("31051945", "DDMMYYYY");
                    var monthsBetween = endMoment.diff(startMoment, 'months');
                    var totalTime = 12;
                    var timePerMonth = totalTime / monthsBetween;
                    for (var currentMoment = moment(startMoment); currentMoment.isBefore(endMoment); currentMoment.add(3, 'months')) {
                        (function () {
                            var currentMonthsBetween = currentMoment.diff(startMoment, 'months');
                            var time = timePerMonth * currentMonthsBetween;

                            timelineDef[time] = function () {
                                slider.property('value', currentMonthsBetween + 2).on('change')();

                                this.setUndo(function () {
                                    slider.property('value', currentMonthsBetween - 1).on('change')();
                                })
                            };
                        })();
                    }

                    var currentMarkerGroup;
                    slider.on('change', function () {
                        var selectedLimit = moment(startMoment).add(slider.property('value') - 1, 'months');

                        var citiesToDisplay = cities.filter(function (city) {
                            return moment(city.properties.attackMonth, "MM-YYYY").isBefore(selectedLimit);
                        });

                        var newMarkerGroup = L.layerGroup();
                        citiesToDisplay.forEach(function (city) {
                            var marker = map.getCircleMarker(city, $translate);
                            newMarkerGroup.addLayer(marker);
                        });

                        if (currentMarkerGroup) {
                            map.leafletMap.removeLayer(currentMarkerGroup);
                        }
                        newMarkerGroup.addTo(map.leafletMap);
                        currentMarkerGroup = newMarkerGroup;
                    });

                    timelineDef[0.001] = legend.style('display', 'block');

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
                        destroyListener();
                    });
                });
            }
        }
    });
})(angular);