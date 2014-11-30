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
            {id: 'green-1', color: '#00FF00', opacity: '0.75', translate: 'translate(440 525)', scale: 'scale(1.75)'},
            {id: 'green-2', color: '#00FF00', opacity: '0.75', translate: 'translate(600 525)', scale: 'scale(1)'},
            {id: 'green-3', color: '#00FF00', opacity: '0.75', translate: 'translate(760 525)', scale: 'scale(2)'},
            {id: 'green-4', color: '#00FF00', opacity: '0.75', translate: 'translate(950 525)', scale: 'scale(1.25)'},
            {id: 'yellow-1', color: '#FFFF00', opacity: '0.9', translate: 'translate(440 525)', scale: 'scale(1.55)'},
            {id: 'red-1', color: '#FF0000', opacity: '0.9', translate: 'translate(675 518)', scale: 'scale(1.2)'},
            {id: 'red-2', color: '#FF0000', opacity: '0.9', translate: 'translate(775 518)', scale: 'scale(1.45)'},
            {id: 'red-3', color: '#FF0000', opacity: '0.9', translate: 'translate(915 518)', scale: 'scale(1)'}
        ];

        var christbaumList = [
            {id: 1, transform: 'translate(30,40)'},
            {id: 2, transform: 'translate(200,80)'},
            {id: 3, transform: 'translate(320,10)'},
            {id: 4, transform: 'translate(470,60)'},
            {id: 5, transform: 'translate(640,40)'},
            {id: 6, transform: 'translate(785,10)'}
        ];

        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                scope.airplanes = airplanes;
                scope.circles = circles;
                scope.christbaumList = christbaumList;
                scope.mosquitoAirplanes = mosquitoAirplanes;
                scope.timelineDef = {};

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

                    // clock
                    var hourScale = d3.scale.linear()
                        .range([0, 330])
                        .domain([0, 11]);
                    var minuteScale = d3.scale.linear()
                        .range([0, 354])
                        .domain([0, 59]);
                    var secondScale = minuteScale;
                    var hourHand = animate.select('.hour-hand');
                    var minuteHand = animate.select('.minute-hand');
                    var secondHand = animate.select('.second-hand');
                    var redClockArea = animate.select('.redclockarea');
                    var greenClockAreas = [];
                    for (var i = 1; i <= 4; i++) {
                        greenClockAreas.push(animate.select('.greenclockarea' + i));
                    }
                    var clockContainer = animate.select('.clock-container');

                    var setTime = function (hour, minute, second, duration, easing) {
                        duration = duration || 500;
                        var hourValue = (hour % 12) + minute / 60;
                        var result = hourHand.attr('transform', 'rotate(' + hourScale(hourValue) + ')', 500).and(minuteHand.attr('transform', 'rotate(' + minuteScale(minute) + ')', duration, easing));
                        var currentTimeText = hour + ':' + minute;
                        if (second !== undefined) {
                            currentTimeText += ':0' + second;
                            result = result.and(secondHand.style('opacity', 1)).and(secondHand.attr('transform', 'rotate(' + secondScale(second) + ')', duration, easing));
                        } else {
                            result = result.and(secondHand.style('opacity', 0, 500));
                        }
                        return result.and(currentTime.text(currentTimeText));
                    };

                    var odometer = new Odometer({
                        el: document.getElementById('bombs-counter'),
                        value: 0,
                        duration: 0,
                        animation: 'count'
                    });

                    angular.extend(scope.timelineDef, {
                        0: airplaneTransitionGroups[0].attr('transform', 'translate(-300 0)', 4000),
                        0.1: function () {
                            $analytics.eventTrack('playing', {
                                category: 'Der Angriff'
                            });
                        },
                        0.2: greenClockAreas[0].style('opacity', 0.6, 5900, 'linear'),
                        6.1: setTime(19, 20).and(greenClockAreas[1].style('opacity', 0.6, 11900, 'linear')),
                        3.5: bomb7.style('opacity', 1, 500),
                        3.6: bomb7.attr('transform', 'translate(600, 420)', 2000),
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
                        12.5: christbaumGroups[6].attr('transform', 'translate(785, 120)', 5000),
                        16.5: christbaumGroups[1].style('opacity', 0, 300),
                        16.7: christbaumGroups[2].style('opacity', 0, 300),
                        16.9: christbaumGroups[3].style('opacity', 0, 300),
                        18.01: setTime(19, 22).and(greenClockAreas[2].style('opacity', 0.6, 7400, 'linear')),
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
                        23.5: mosquitoTransitionGroups[0].attr('transform', 'translate(3400 70)', 3000),
                        23.9: mosquitoTransitionGroups[1].attr('transform', 'translate(3600 20)', 3000),
                        24.5: mosquitoTransitionGroups[2].attr('transform', 'translate(3800 100)', 3000),
                        25: mosquitoTransitionGroups[3].attr('transform', 'translate(31000 40)', 3000),
                        23.1: airplaneTransitionGroups[0].attr('transform', 'translate(-3000 0)'),
                        24: airplaneTransitionGroups[0].attr('transform', 'translate(-300 250)', 2000),
                        26: airplaneTransitionGroups[0].attr('transform', 'translate(3600 200)', 12000),
                        25.5: setTime(19, 27).and(greenClockAreas[3].style('opacity', 0.6, 11400, 'linear')),
                        34: clockContainer.attr('transform', 'translate(350, -330)', 1500),
                        35: setTime(19, 29, 0),
                        35.01: bombsCounter.style('display', 'inline'),
                        35.02: bombsCounterLabel.style('display', 'inline'),
                        36: bombsCounter.text('400').and(setTime(19, 29, 1)).and(cloud.style('opacity', 0.4, 16000)),
                        37: bombsCounter.text('800').and(setTime(19, 29, 2)),
                        38: bombsCounter.text('1200').and(setTime(19, 29, 3)),
                        39: bombsCounter.text('1600').and(setTime(19, 29, 4)),
                        40: bombsCounter.text('1800').and(setTime(19, 29, 5)),
                        41: redClockArea.style('opacity', 0.6, 3000).and(function () {
                            odometer.options.duration = 3000;
                            odometer.options.value = 245029;
                            this.setUndo(function () {
                                odometer.options.duration = 0;
                            })
                        }).and(bombsCounter.text('245029')).and(setTime(19, 40, undefined, 3000, 'linear')),
                        57.5: imgs['feuersturm'].style('opacity', 1, 1000),
                        62: imgs['hotel'].style('opacity', 1, 0),
                        62.01: imgs['feuersturm'].style('opacity', 0, 1000),
                        66: imgs['hbf'].style('opacity', 1, 0),
                        66.01: imgs['hotel'].style('opacity', 0, 1000)
                    });

                    var addCircle = function (time, circle) {
                        scope.timelineDef[time] = animate.select('.circle-' + circle.id).style('opacity', 1, 3000);
                        scope.timelineDef[time + 0.01] = animate.select('.circle-' + circle.id + ' .inner-circle-1').style('opacity', 1, 500);
                        scope.timelineDef[time + 0.02] = animate.select('.circle-' + circle.id + ' .inner-circle-2').style('opacity', 0.75, 1000);
                        scope.timelineDef[time + 0.03] = animate.select('.circle-' + circle.id + ' .inner-circle-3').style('opacity', 0.5, 1500);
                        scope.timelineDef[time + 0.04] = animate.select('.circle-' + circle.id + ' .inner-circle-4').style('opacity', 0.25, 2000);
                        scope.timelineDef[time + 0.05] = animate.select('.circle-' + circle.id + ' .inner-circle-5').style('opacity', 0.1, 2500);
                    };
                    var removeCircle = function (time, circle) {
                        scope.timelineDef[time] = animate.select('.circle-' + circle.id).style('opacity', 0, 3000);
                    };
                    var scaleCircle = function (time, circle, newScale) {
                        scope.timelineDef[time] = animate.select('.circle-' + circle.id + ' .inner-circle-group').attr('transform', 'scale(' + newScale + ')', 3000);
                    };
                    var modifyCircleColor = function (time, circle, color) {
                        scope.timelineDef[time] = animate.select('.circle-' + circle.id + ' .inner-circle-1').attr('fill', color, 500);
                        scope.timelineDef[time + 0.01] = animate.select('.circle-' + circle.id + ' .inner-circle-2').attr('fill', color, 1000);
                        scope.timelineDef[time + 0.02] = animate.select('.circle-' + circle.id + ' .inner-circle-3').attr('fill', color, 1500);
                        scope.timelineDef[time + 0.03] = animate.select('.circle-' + circle.id + ' .inner-circle-4').attr('fill', color, 2000);
                        scope.timelineDef[time + 0.04] = animate.select('.circle-' + circle.id + ' .inner-circle-5').attr('fill', color, 2500);
                    };
                    addCircle(5.4, circles[0]);
                    addCircle(6.2, circles[1]);
                    addCircle(5, circles[2]);
                    addCircle(5.8, circles[3]);
                    addCircle(21.6, circles[4]);
                    addCircle(19.2, circles[5]);
                    addCircle(19.9, circles[6]);
                    addCircle(20.5, circles[7]);
                    removeCircle(36.05, circles[0]);
                    removeCircle(38.05, circles[2]);
                    removeCircle(40.05, circles[3]);
                    modifyCircleColor(44.05, circles[1], '#FF0000');
                    modifyCircleColor(45.05, circles[4], '#FF0000');
                    scaleCircle(41.05, circles[5], 1.5);
                    scaleCircle(42.05, circles[6], 1.75);
                    scaleCircle(43.05, circles[7], 1.25);

                    Talkie.timeline("#audio-container audio", scope.timelineDef);
                }, 500);
            }
        }
    });
})(angular);