(function (angular) {
    'use strict';

    var map = {
        leafletMap: null,
        layers: {},
        init: function () {
            this.leafletMap = L.map('comparison-map', {
                center: [51.1633, 10.4476],
                zoom: 6,
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
        addCircleMarker: function (lat, lon) {
            var marker = L.circleMarker(L.latLng(lat, lon), {
                fillColor: '#FF0000',
                strokeColor: '#FF0000',
                color: '#FF0000'
            });
            map.leafletMap.addLayer(marker);
            return marker;
        }
    };

    angular.module('app').directive('comparison', function ($http) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                map.init();
                var animate = Talkie.animate(element[0]);

                var cities = [];
                $http.get('data/cities.json').success(function (geojson) {
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

                // TODO setTimeout is a temporary workaround
                setTimeout(function () {
                    var timelineDef = {};
                    var startMoment = moment("01021942", "DDMMYYYY");
                    var endMoment = moment("30081943", "DDMMYYYY");
                    var monthsBetween = endMoment.diff(startMoment, 'months');
                    var totalTime = 24;
                    var timePerMonth = totalTime / monthsBetween;
                    for (var currentMoment = moment(startMoment); currentMoment.isBefore(endMoment); currentMoment.add(2, 'months')) {
                        (function () {
                            var citiesToDisplay = cities.filter(function (city) {
                                return city.properties.month === currentMoment.format("MM-YYYY");
                            });
                            var currentMonthsBetween = currentMoment.diff(startMoment, 'months');
                            var time = timePerMonth * currentMonthsBetween;

                            timelineDef[time] = function () {
                                var markers = [];
                                citiesToDisplay.forEach(function (city) {
                                    var marker = map.addCircleMarker(city.geometry.coordinates[1], city.geometry.coordinates[0]);
                                    markers.push(marker);
                                });

                                this.setUndo(function () {
                                    markers.forEach(function (marker) {
                                        map.leafletMap.removeLayer(marker);
                                    })
                                })
                            };
                        })();
                    }
                    timelineDef[0.1] = function () {
                        d3.select('.line').classed('line-fill', true).datum(effectivityData).attr("d", line);
                        $analytics.eventTrack('playing', {
                            category: 'Der Luftkrieg'
                        });
                    };

                    Talkie.timeline("#audio-container audio", timelineDef);
                }, 500);
            }
        }
    });
})(angular);