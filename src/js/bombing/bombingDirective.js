(function (angular) {
    'use strict';
    angular.module('app').directive('bombing', function ($analytics, $timeout) {
        var airplanes = [
            {id: 0, transform: 'translate(-1060 -30)'},
            {id: 1, transform: 'translate(-725 15)'},
            {id: 2, transform: 'translate(-610 -50)'},
            {id: 3, transform: 'translate(-300 0)'}
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
                scope.showBombsInteractive = false;

                var svg = element[0],
                    animate = Talkie.animate(document.getElementById('bombs-wrapper'));

                $timeout(function () {
                    var airplaneTransitionGroups = [];
                    airplanes.forEach(function (airplane) {
                        airplaneTransitionGroups.push({
                            'outer': animate.select('.airplane-' + airplane.id),
                            'inner': animate.select('.airplane-' + airplane.id + ' g')
                        });
                    });
                    var airplanesGroup = animate.select('.airplanes');
                    var mosquitoTransitionGroups = [];
                    mosquitoAirplanes.forEach(function (mosquito) {
                        mosquitoTransitionGroups.push(animate.select('.mosquito-' + mosquito.id));
                    });
                    var christbaumGroups = [];
                    christbaumList.forEach(function (christbaum) {
                        christbaumGroups[christbaum.id] = animate.select('.christbaum-' + christbaum.id);
                    });
                    var currentTime = animate.select('.current-time');
                    var bombsCounter = animate.select('.bombs-counter');
                    var bombsCounterLabel = animate.select('.bombs-counter-label');
                    var bombs = animate.select('.bombs');
                    var explosiveBombs = animate.select('.explosive-bombs');
                    var explosiveBombsLabel = animate.select('.explosive-bombs text');
                    var fireBombs = animate.select('.fire-bombs');
                    var fireBombsLabel = animate.select('.fire-bombs text');
                    var cloud = animate.select('.cloud');

                    var imgClasses = ['hbf', 'hotel', 'feuersturm', 'brand3'];
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
                    var redClockArea2 = animate.select('.redclockarea2');
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
                        animation: 'count',
                        format: '( ddd),dd'
                    });

                    var togglePlane = function (index, opacity, duration) {
                        return airplaneTransitionGroups[index].inner.style('opacity', opacity, duration);
                    };
                    var movePlanes = function (x, y, duration, easing) {
                        return airplanesGroup.attr('transform', 'translate(' + x + ' ' + y + ')', duration, easing);
                    };

                    angular.extend(scope.timelineDef, {
                        0: greenClockAreas[0].style('opacity', 0.6, 5900, 'linear').and(function () {
                            $analytics.eventTrack('playing', {
                                category: 'Der Angriff'
                            });
                        }),
                        0.5: movePlanes(1060, 0, 3000),
                        1: togglePlane(3, 1, 1000),
                        1.75: togglePlane(2, 1, 750),
                        2.5: togglePlane(1, 1, 500),
                        2.9: togglePlane(0, 1, 500),
                        6.1: setTime(19, 20).and(greenClockAreas[1].style('opacity', 0.6, 11900, 'linear')),
                        7: christbaumGroups[1].style('opacity', 1, 3000),
                        7.2: christbaumGroups[2].style('opacity', 1, 3000),
                        7.4: christbaumGroups[3].style('opacity', 1, 3000),
                        7.6: christbaumGroups[4].style('opacity', 1, 3000),
                        7.8: christbaumGroups[5].style('opacity', 1, 3000),
                        8: christbaumGroups[6].style('opacity', 1, 3000),
                        11.5: christbaumGroups[1].attr('transform', 'translate(30, 200)', 10000, 'linear'),
                        11.7: christbaumGroups[2].attr('transform', 'translate(200, 240)', 10000, 'linear'),
                        11.9: christbaumGroups[3].attr('transform', 'translate(320, 170)', 10000, 'linear'),
                        12.1: christbaumGroups[4].attr('transform', 'translate(470, 220)', 10000, 'linear'),
                        12.3: christbaumGroups[5].attr('transform', 'translate(640, 210)', 10000, 'linear'),
                        12.5: christbaumGroups[6].attr('transform', 'translate(785, 170)', 10000, 'linear'),
                        16.5: christbaumGroups[1].style('opacity', 0, 4000),
                        16.7: christbaumGroups[2].style('opacity', 0, 4000),
                        16.9: christbaumGroups[3].style('opacity', 0, 4000),
                        18.01: setTime(19, 22).and(greenClockAreas[2].style('opacity', 0.6, 7400, 'linear')),
                        17.1: christbaumGroups[4].style('opacity', 0, 4000),
                        17.4: christbaumGroups[5].style('opacity', 0, 4000),
                        17.5: christbaumGroups[6].style('opacity', 0, 4000),
                        14: airplaneTransitionGroups[0].outer.attr('transform', 'translate(6000 0)', 3000),
                        14.4: airplaneTransitionGroups[3].outer.attr('transform', 'translate(6000 0)', 3000),
                        14.8: airplaneTransitionGroups[2].outer.attr('transform', 'translate(6000 0)', 3000),
                        15.2: airplaneTransitionGroups[1].outer.attr('transform', 'translate(6000 0)', 3000),
                        17: mosquitoTransitionGroups[0].attr('transform', 'translate(400 70)', 2000),
                        18: mosquitoTransitionGroups[1].attr('transform', 'translate(600 20)', 2000),
                        19: mosquitoTransitionGroups[2].attr('transform', 'translate(800 100)', 2000),
                        21.5: mosquitoTransitionGroups[3].attr('transform', 'translate(1000 40)', 2000),
                        23.5: mosquitoTransitionGroups[0].attr('transform', 'translate(3400 70)', 3000),
                        23.9: mosquitoTransitionGroups[1].attr('transform', 'translate(3600 20)', 3000),
                        24.5: mosquitoTransitionGroups[2].attr('transform', 'translate(3800 100)', 3000),
                        25: mosquitoTransitionGroups[3].attr('transform', 'translate(31000 40)', 3000),
                        23.1: togglePlane(0, 0, 0),
                        25.1: airplaneTransitionGroups[0].outer.attr('transform', 'translate(-1300 220)').and(airplaneTransitionGroups[0].outer.attr('transform', 'translate(0 200)', 12000, 'linear')),
                        25.35: togglePlane(0, 1, 3000),
                        25.5: setTime(19, 27).and(greenClockAreas[3].style('opacity', 0.6, 11400, 'linear')),
                        34: clockContainer.attr('transform', 'translate(350, -330)', 1500),
                        35: setTime(19, 29, 0).and(bombsCounter.style('display', 'inline')).and(bombsCounterLabel.style('display', 'block')).and(togglePlane(0, 0, 1000)),
                        36: bombsCounter.text('400').and(setTime(19, 29, 1)).and(cloud.style('opacity', 0.4, 16000)),
                        37: bombsCounter.text('800').and(setTime(19, 29, 2)),
                        38: bombsCounter.text('1200').and(setTime(19, 29, 3)),
                        39: bombsCounter.text('1600').and(setTime(19, 29, 4)),
                        40: bombsCounter.text('2000').and(setTime(19, 29, 5)),
                        41: redClockArea.style('opacity', 0.6, 4000).and(redClockArea2.style('opacity', 0.6, 8000)).and(function () {
                            odometer.options.duration = 8000;
                            odometer.options.value = 245029;
                            this.setUndo(function () {
                                odometer.options.duration = 0;
                            })
                        }).and(bombsCounter.text('245029')).and(setTime(19, 55, undefined, 8000, 'linear')),
                        56: imgs['feuersturm'].style('opacity', 1, 1000),
                        59.5: imgs['hotel'].style('opacity', 1, 300).and(imgs['feuersturm'].style('opacity', 0, 1000)),
                        63: imgs['brand3'].style('opacity', 1, 300).and(imgs['hotel'].style('opacity', 0, 1000)),
                        66: imgs['hbf'].style('opacity', 1, 300).and(imgs['brand3'].style('opacity', 0, 1000)).and(function () {
                            var promise = $timeout(function () {
                                scope.showEndscreen = true;
                            }, 3000);
                            this.setUndo(function () {
                                $timeout.cancel(promise);
                                scope.showEndscreen = false;
                                scope.showBombsInteractive = false;
                            })
                        })
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
                    addCircle(4.5, circles[0]);
                    addCircle(3.75, circles[1]);
                    addCircle(3, circles[2]);
                    addCircle(2.3, circles[3]);
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

                    var talkie = Talkie.timeline("#audio-container audio", scope.timelineDef);
                    scope.$on('$destroy', function () {
                        talkie.destroy();
                    })
                }, 500);
            }
        }
    });
})(angular);