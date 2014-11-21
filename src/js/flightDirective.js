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

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    angular.module('app').directive('flight', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                map.init();

                scope.lancesterGroups = [];
                // (28*8)+(22*2)+(10*3)-16 oder (28*8)+(18*2)+(10*3)
                var groupsToBuild = [{
                    columns: 27,
                    rowOffset: 0,
                    rows: 8
                }, {
                    columns: 18,
                    rowOffset: 8,
                    rows: 2
                }, {
                    columns: 10,
                    rowOffset: 10,
                    rows: 3
                }];
                groupsToBuild.forEach(function (groupToBuild) {
                    var group = [];
                    for (var i = 0; i < groupToBuild.columns; i++) {
                        group.push({
                            'id': i,
                            'transform': 'scale(0.06) translate(' + i * 580 + ' 0)'
                        });
                    }
                    for (var i = 0; i < groupToBuild.rows; i++) {
                        var rowId = i + groupToBuild.rowOffset;
                        scope.lancesterGroups.push({
                            'id': rowId,
                            'transform': 'translate(0 ' + rowId * 40 + ')',
                            'lancesters': group
                        });
                    }
                });

                var mosquitos = [];
                for (var j = 0; j < 5; j++) {
                    mosquitos.push({
                        id: j,
                        transform: 'translate(' + j * 32 + ' 0)'
                    })
                }
                scope.mosquitoGroups = [];
                for (var i = 0; i < 2; i++) {
                    scope.mosquitoGroups.push({
                        id: i,
                        transform: 'translate(0 ' + i * 30 + ')',
                        mosquitos: mosquitos
                    })
                }

                var svg = element[0],
                    animate = Talkie.animate(svg);

                // TODO setTimeout is a temporary workaround
                setTimeout(function () {
                    var timelineDef = {};
                    var opacityTime = 10;

                    var lancesters = [];
                    scope.lancesterGroups.forEach(function (group) {
                        group.lancesters.forEach(function (lancester) {
                            lancesters.push(animate.select('.lancester-' + group.id + '-' + lancester.id));
                        })
                    });
                    var lancesterCounter = animate.select('.lancester-counter');
                    var timePerLancester = opacityTime / lancesters.length;
                    shuffle(lancesters);
                    var count = 0;
                    lancesters.forEach(function (lancester, index) {
                        count++;
                        timelineDef[index * timePerLancester] = lancester.style('opacity', 1);
                        timelineDef[index * timePerLancester + 0.001] = lancesterCounter.text(count);
                    });

                    var mosquitos = [];
                    scope.mosquitoGroups.forEach(function (group) {
                        group.mosquitos.forEach(function (mosquito) {
                            mosquitos.push(animate.select('.mosquito-' + group.id + '-' + mosquito.id));
                        })
                    });
                    var mosquitoCounter = animate.select('.mosquito-counter');
                    var timePerMosquito = opacityTime / mosquitos.length;
                    shuffle(mosquitos);
                    var mosquitoCount = 0;
                    mosquitos.forEach(function (mosquito, index) {
                        mosquitoCount++;
                        timelineDef[index * timePerMosquito + 0.001] = mosquito.style('opacity', 1);
                        timelineDef[index * timePerMosquito + 0.002] = mosquitoCounter.text(mosquitoCount);
                    });

                    var timeline = Talkie.timeline("#audio-container audio", timelineDef);
                    Talkie.ui.playButton("#a-wrapper", timeline);
                }, 500);
            }
        }
    });
})(angular);