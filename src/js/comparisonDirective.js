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
        addCircleMarker: function (city) {
            var marker = L.circleMarker(L.latLng(city.geometry.coordinates[1], city.geometry.coordinates[0]), {
                fillColor: '#FF0000',
                strokeColor: '#FF0000',
                color: '#FF0000',
                opacity: 0,
                fillOpacity: 0.3,
                radius: 10
            });
            marker.bindPopup('<p class="leaflet-popup-title">' + city.properties.name + '</p><p>Schwerster Angriff: ' + city.properties.attackDate + '</p>');
            map.leafletMap.addLayer(marker);
            return marker;
        },
        addLegend: function () {
            var legend = L.control({position: 'bottomleft'});
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

    angular.module('app').directive('comparison', function ($http, $analytics, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                moment.locale("de");
                map.init();
                var animate = Talkie.animate(element[0]);

                var cities = [];
                var dataPromise = $http.get('data/cities.json').success(function (geojson) {
                    cities = geojson.features;
                });

                // chart
                var margin = {top: 20, right: 20, bottom: 30, left: 50},
                    width = 960 - margin.left - margin.right,
                    height = 560 - margin.top - margin.bottom;

                var x = d3.time.scale()
                    .range([0, width]);

                var y = d3.scale.linear()
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");

                var line = d3.svg.line()
                    .x(function (d) {
                        return x(d.date);
                    })
                    .y(function (d) {
                        return y(d.effectivity);
                    });

                var svg = d3.select(".comparison-chart")
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var effectivityData;
                d3.csv("data/effectivity.csv", function (error, data) {
                    effectivityData = data;
                    data.forEach(function (d) {
                        d.date = moment(d.date, 'MM-YYYY');
                        d.effectivity = +d.effectivity;
                    });

                    x.domain(d3.extent(data, function (d) {
                        return d.date;
                    }));
                    y.domain(d3.extent(data, function (d) {
                        return d.effectivity;
                    }));

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text("Treffgenauigkeit der Nachtangriffe in Prozent");

                    svg.append("path")
                        .attr("class", "line")
                });

                dataPromise.then(function () {
                    var legend = animate.select('.legend');
                    var currentDate = animate.select('.current-date');
                    var timelineDef = {};
                    var startMoment = moment("01021942", "DDMMYYYY");
                    var endMoment = moment("31051945", "DDMMYYYY");
                    var monthsBetween = endMoment.diff(startMoment, 'months');
                    var totalTime = 18;
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
                                    var marker = map.addCircleMarker(city);
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
                    ['wiederaufbau', 'wiederaufbau2'].forEach(function (imgClass) {
                        imgs[imgClass] = animate.select('.img-' + imgClass);
                    });
                    var imgsContainer = animate.select('.imgs');
                    var swapImage = function (toShow, toHide) {
                        return imgs[toShow].style('opacity', 1, 300).and(imgs[toHide].style('opacity', 0, 1000));
                    };

                    timelineDef[22] = imgsContainer.style('display', 'block');
                    timelineDef[25] = swapImage('wiederaufbau2', 'wiederaufbau');

                    timelineDef[26] = function () {
                        var promise = $timeout(function () {
                            scope.showEndscreen = true;
                        }, 2000);
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