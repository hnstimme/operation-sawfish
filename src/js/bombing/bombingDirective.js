(function (angular) {
    'use strict';
    angular.module('app').directive('bombing', function ($analytics) {
        var airplanes = [
            {id: 0},
            {id: 1},
            {id: 2},
            {id: 3},
            {id: 4}
        ];

        var mosquitoAirplanes = [
            {id: 0},
            {id: 1},
            {id: 2},
            {id: 3}
        ];

        var circles = [
            {id: 'green-1', color: '#00FF00'},
            {id: 'green-2', color: '#00FF00', transform: 'translate(160,0)'},
            {id: 'green-3', color: '#00FF00', transform: 'translate(330,0)'},
            {id: 'green-4', color: '#00FF00', transform: 'translate(510,0)'},
            {id: 'yellow-1', color: '#FFFF00', transform: 'translate(300, -350) scale(2)'},
            {id: 'red-1', color: '#FF0000', transform: 'translate(245,0)'},
            {id: 'red-2', color: '#FF0000', transform: 'translate(330,0)'},
            {id: 'red-3', color: '#FF0000', transform: 'translate(480,0)'}
        ];

        var christbaumList = [
            {id: 1, transform: 'translate(30,40)'},
            {id: 2, transform: 'translate(200,80)'},
            {id: 3, transform: 'translate(320,10)'},
            {id: 4, transform: 'translate(470,60)'},
            {id: 5, transform: 'translate(640,40)'},
            {id: 6, transform: 'translate(785,120)'}
        ];

        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                scope.airplanes = airplanes;
                scope.circles = circles;
                scope.christbaumList = christbaumList;
                scope.mosquitoAirplanes = mosquitoAirplanes;

                var svg = element[0],
                    animate = Talkie.animate(document.getElementById('bombs-wrapper'));

                // TODO setTimeout is a temporary workaround
                setTimeout(function () {
                    var airplaneTransitionGroups = [];
                    airplanes.forEach(function (airplane) {
                        airplaneTransitionGroups.push(animate.select('.airplane-' + airplane.id + ' g'));
                    });
                    var mosquitoTransitionGroups = [];
                    mosquitoAirplanes.forEach(function (mosquito) {
                        mosquitoTransitionGroups.push(animate.select('.mosquito-' + mosquito.id));
                    });
                    var circleGroups = [];
                    circles.forEach(function (circle) {
                        circleGroups[circle.id] = animate.select('.circle-' + circle.id);
                    });
                    var christbaumGroups = [];
                    christbaumList.forEach(function (christbaum) {
                        christbaumGroups[christbaum.id] = animate.select('.christbaum-' + christbaum.id);
                    });
                    var bomb7 = animate.select('.bomb7');
                    var currentTime = animate.select('.current-time');
                    var bombsCounter = animate.select('.bombs-counter');
                    var bombsCounterLabel = animate.select('.bombs-counter-label');
                    var bombs = animate.select('.bombs');
                    var cloud = animate.select('.cloud');

                    var imgClasses = ['hbf', 'hotel', 'feuersturm'];
                    var imgs = [];
                    imgClasses.forEach(function (imgClass) {
                        imgs[imgClass] = animate.select('.img-' + imgClass);
                    });

                    var timeline = Talkie.timeline("#audio-container audio", {
                        0: airplaneTransitionGroups[0].attr('transform', 'translate(-300 0)', 4000),
                        0.1: function () {
                            $analytics.eventTrack('playing', {
                                category: 'Der Angriff'
                            });
                        },
                        8.1: currentTime.text('19:20'),
                        3.5: bomb7.style('opacity', 1, 500),
                        3.6: bomb7.attr('transform', 'translate(600, 420)', 2000),
                        5.4: circleGroups['green-1'].style('opacity', 1, 300),
                        6.2: circleGroups['green-2'].style('opacity', 1, 300),
                        5: circleGroups['green-3'].style('opacity', 1, 300),
                        5.8: circleGroups['green-4'].style('opacity', 1, 300),
                        5.5: bomb7.style('opacity', 0, 1000),
                        7: airplaneTransitionGroups[0].attr('transform', 'translate(6000 0)', 3000),
                        7.5: airplaneTransitionGroups[1].attr('transform', 'translate(-300 0)', 2000),
                        8: airplaneTransitionGroups[2].attr('transform', 'translate(600 -150)', 2000),
                        8.5: airplaneTransitionGroups[3].attr('transform', 'translate(1200 50)', 2000),
                        9: airplaneTransitionGroups[4].attr('transform', 'translate(2000 -100)', 2000),
                        11: christbaumGroups[1].style('opacity', 1, 300),
                        11.2: christbaumGroups[2].style('opacity', 1, 300),
                        11.4: christbaumGroups[3].style('opacity', 1, 300),
                        11.6: christbaumGroups[4].style('opacity', 1, 300),
                        11.8: christbaumGroups[5].style('opacity', 1, 300),
                        12: christbaumGroups[6].style('opacity', 1, 300),
                        11.5: christbaumGroups[1].attr('transform', 'translate(30, 150)', 5000),
                        11.7: christbaumGroups[2].attr('transform', 'translate(200, 190)', 5000),
                        11.9: christbaumGroups[3].attr('transform', 'translate(320, 120)', 5000),
                        12.1: christbaumGroups[4].attr('transform', 'translate(470, 170)', 5000),
                        12.3: christbaumGroups[5].attr('transform', 'translate(640, 160)', 5000),
                        12.5: christbaumGroups[6].attr('transform', 'translate(785, 230)', 5000),
                        16.5: christbaumGroups[1].style('opacity', 0, 300),
                        16.7: christbaumGroups[2].style('opacity', 0, 300),
                        16.9: christbaumGroups[3].style('opacity', 0, 300),
                        16.01: currentTime.text('19:22'),
                        17.1: christbaumGroups[4].style('opacity', 0, 300),
                        17.4: christbaumGroups[5].style('opacity', 0, 300),
                        17.5: christbaumGroups[6].style('opacity', 0, 300),
                        14: airplaneTransitionGroups[4].attr('transform', 'translate(6000 0)', 3000),
                        14.4: airplaneTransitionGroups[3].attr('transform', 'translate(6000 0)', 3000),
                        14.8: airplaneTransitionGroups[2].attr('transform', 'translate(6000 0)', 3000),
                        15.2: airplaneTransitionGroups[1].attr('transform', 'translate(6000 0)', 3000),
                        17: mosquitoTransitionGroups[0].attr('transform', 'translate(400 70)', 2000),
                        18: mosquitoTransitionGroups[1].attr('transform', 'translate(600 20)', 2000),
                        19: mosquitoTransitionGroups[2].attr('transform', 'translate(800 100)', 2000),
                        21.5: mosquitoTransitionGroups[3].attr('transform', 'translate(1000 40)', 2000),
                        19.2: circleGroups['red-1'].style('opacity', 1, 300),
                        20: circleGroups['red-2'].style('opacity', 1, 300),
                        21: circleGroups['red-3'].style('opacity', 1, 300),
                        23: circleGroups['yellow-1'].style('opacity', 1, 300),
                        23.5: mosquitoTransitionGroups[0].attr('transform', 'translate(3400 70)', 3000),
                        23.9: mosquitoTransitionGroups[1].attr('transform', 'translate(3600 20)', 3000),
                        24.5: mosquitoTransitionGroups[2].attr('transform', 'translate(3800 100)', 3000),
                        25: mosquitoTransitionGroups[3].attr('transform', 'translate(31000 40)', 3000),
                        23.1: airplaneTransitionGroups[0].attr('transform', 'translate(-3000 0)'),
                        24: airplaneTransitionGroups[0].attr('transform', 'translate(-300 250)', 2000),
                        26: airplaneTransitionGroups[0].attr('transform', 'translate(3600 200)', 12000),
                        32: currentTime.text('19:27'),
                        38: currentTime.text('19:29:01').attr('transform', 'translate(350 -400)', 1000),
                        38.01: bombsCounter.style('display', 'inline'),
                        38.02: bombsCounterLabel.style('display', 'inline'),
                        39: bombsCounter.text('400'),
                        39.01: currentTime.text('19:29:02'),
                        39.05: cloud.style('opacity', 0.4, 6000),
                        40: bombsCounter.text('800'),
                        40.01: currentTime.text('19:29:03'),
                        41: bombsCounter.text('1200'),
                        41.01: currentTime.text('19:29:04'),
                        42: bombsCounter.text('1600'),
                        42.01: currentTime.text('19:29:05'),
                        42.02: function () {
                            var odometer = new Odometer({
                                el: document.getElementById('bombs-counter'),
                                value: 1600,
                                duration: 10000,
                                animation: 'count'
                            });
                        },
                        43.02: bombsCounter.text('245029'),
                        43.01: currentTime.text('19:30'),
                        44.01: currentTime.text('19:31'),
                        45.01: currentTime.text('19:32'),
                        46.01: currentTime.text('19:33'),
                        47.01: currentTime.text('19:34'),
                        48.01: currentTime.text('19:35'),
                        49.01: currentTime.text('19:36'),
                        50.01: currentTime.text('19:37'),
                        51.01: currentTime.text('19:38'),
                        52.01: currentTime.text('19:30'),
                        53.01: currentTime.text('19:40'),
                        62.5: imgs['feuersturm'].style('opacity', 1, 1000),
                        67: imgs['hotel'].style('opacity', 1, 0),
                        67.01: imgs['feuersturm'].style('opacity', 0, 1000),
                        71: imgs['hbf'].style('opacity', 1, 0),
                        71.01: imgs['hotel'].style('opacity', 0, 1000)
                    });
                }, 500);
            }
        }
    });
})(angular);