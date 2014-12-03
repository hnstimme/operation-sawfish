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
            {id: 1, transform: 'translate(30,40)', endPosition: '30, 200'},
            {id: 2, transform: 'translate(200,80)', endPosition: '200, 240'},
            {id: 3, transform: 'translate(320,10)', endPosition: '320, 170'},
            {id: 4, transform: 'translate(470,60)', endPosition: '470, 220'},
            {id: 5, transform: 'translate(640,40)', endPosition: '640, 210'},
            {id: 6, transform: 'translate(785,10)', endPosition: '785, 170'}
        ];

        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                scope.circles = circles;
                scope.timelineDef = {};
                scope.showBombsInteractive = false;

                var svg = element[0],
                    animate = Talkie.animate(document.getElementById('bombs-wrapper'));

                $timeout(function () {
                    var airplaneTransitionGroups = [];
                    airplanes.forEach(function (airplane) {
                        airplaneTransitionGroups.push({
                            'outer': animate.select('.airplane-' + airplane.id),
                            'inner': animate.select('.airplane-' + airplane.id + ' use')
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

                    var addCircle = function (circle) {
                        var timelineEntry = animate.select('.circle-' + circle.id).style('opacity', 1, 3000);
                        timelineEntry = timelineEntry.and(animate.select('.circle-' + circle.id + ' .inner-circle-1').style('opacity', 1, 500));
                        timelineEntry = timelineEntry.and(animate.select('.circle-' + circle.id + ' .inner-circle-2').style('opacity', 0.75, 1000));
                        timelineEntry = timelineEntry.and(animate.select('.circle-' + circle.id + ' .inner-circle-3').style('opacity', 0.5, 1500));
                        timelineEntry = timelineEntry.and(animate.select('.circle-' + circle.id + ' .inner-circle-4').style('opacity', 0.25, 2000));
                        timelineEntry = timelineEntry.and(animate.select('.circle-' + circle.id + ' .inner-circle-5').style('opacity', 0.1, 2500));
                        return timelineEntry;
                    };
                    var removeCircle = function (circle) {
                        return animate.select('.circle-' + circle.id).style('opacity', 0, 3000);
                    };
                    var scaleCircle = function (circle, newScale) {
                        return animate.select('.circle-' + circle.id + ' .inner-circle-group').attr('transform', 'scale(' + newScale + ')', 3000);
                    };
                    var modifyCircleColor = function (circle, color) {
                        var timelineEntry = animate.select('.circle-' + circle.id + ' .inner-circle-1').attr('fill', color, 500);
                        timelineEntry = timelineEntry.and(animate.select('.circle-' + circle.id + ' .inner-circle-2').attr('fill', color, 1000));
                        timelineEntry = timelineEntry.and(animate.select('.circle-' + circle.id + ' .inner-circle-3').attr('fill', color, 1500));
                        timelineEntry = timelineEntry.and(animate.select('.circle-' + circle.id + ' .inner-circle-4').attr('fill', color, 2000));
                        timelineEntry = timelineEntry.and(animate.select('.circle-' + circle.id + ' .inner-circle-5').attr('fill', color, 2500));
                        return timelineEntry;
                    };

                    var updateOdometer = function (duration, value) {
                        return function () {
                            odometer.options.duration = duration;
                            odometer.options.value = value;
                            this.setUndo(function () {
                                odometer.options.duration = 0;
                            })
                        }
                    };

                    var updateChristbaumsOpacity = function (opacity, duration, durationDelta) {
                        var timelineEntry = christbaumGroups[1].style('opacity', opacity, duration);
                        christbaumGroups.forEach(function (christbaumGroup, index) {
                            if (index > 1) {
                                timelineEntry = timelineEntry.and(christbaumGroup.style('opacity', opacity, duration + durationDelta * index));
                            }
                        });
                        return timelineEntry;
                    };

                    var moveChristbaumsToEndPosition = function (duration, durationDelta) {
                        var timelineEntry = christbaumGroups[1].attr('transform', 'translate(' + christbaumList[0].endPosition + ')', duration, 'linear');
                        christbaumList.forEach(function (christbaum) {
                            if (christbaum.id > 1) {
                                timelineEntry = timelineEntry.and(christbaumGroups[christbaum.id].attr('transform', 'translate(' + christbaum.endPosition + ')', duration + durationDelta * (christbaum.id - 1), 'linear'));
                            }
                        });
                        return timelineEntry;
                    };

                    angular.extend(scope.timelineDef, {
                        0: greenClockAreas[0].style('opacity', 0.6, 5900, 'linear').and(function () {
                            $analytics.eventTrack('playing', {
                                category: 'Der Angriff'
                            });
                        }),
                        0.5: movePlanes(1060, 0, 3000),
                        1: togglePlane(3, 1, 1000).and(togglePlane(2, 1, 1500)).and(togglePlane(1, 1, 2000)).and(togglePlane(0, 1, 3400)),
                        2.3: addCircle(circles[3]),
                        3: addCircle(circles[2]),
                        3.75: addCircle(circles[1]),
                        4.5: addCircle(circles[0]),
                        6.1: setTime(19, 20).and(greenClockAreas[1].style('opacity', 0.6, 11900, 'linear')),
                        7: updateChristbaumsOpacity(1, 3000, 200),
                        11.5: moveChristbaumsToEndPosition(10000, 200),
                        14: airplaneTransitionGroups[0].outer.attr('transform', 'translate(6000 0)', 3000),
                        14.4: airplaneTransitionGroups[3].outer.attr('transform', 'translate(6000 0)', 3000),
                        14.8: airplaneTransitionGroups[2].outer.attr('transform', 'translate(6000 0)', 3000),
                        15.2: airplaneTransitionGroups[1].outer.attr('transform', 'translate(6000 0)', 3000),
                        16.5: updateChristbaumsOpacity(0, 4000, 200),
                        17: mosquitoTransitionGroups[0].attr('transform', 'translate(400 70)', 2000),
                        18: mosquitoTransitionGroups[1].attr('transform', 'translate(600 20)', 2000).and(setTime(19, 22).and(greenClockAreas[2].style('opacity', 0.6, 7400, 'linear'))),
                        19: mosquitoTransitionGroups[2].attr('transform', 'translate(800 100)', 2000),
                        19.4: addCircle(circles[5]),
                        19.9: addCircle(circles[6]),
                        20.5: addCircle(circles[7]),
                        21.5: mosquitoTransitionGroups[3].attr('transform', 'translate(1000 40)', 2000),
                        21.6: addCircle(circles[4]),
                        23.1: togglePlane(0, 0, 0),
                        23.5: mosquitoTransitionGroups[0].attr('transform', 'translate(3400 70)', 3000),
                        23.9: mosquitoTransitionGroups[1].attr('transform', 'translate(3600 20)', 3000),
                        24.5: mosquitoTransitionGroups[2].attr('transform', 'translate(3800 100)', 3000),
                        25: mosquitoTransitionGroups[3].attr('transform', 'translate(31000 40)', 3000).and(airplaneTransitionGroups[0].outer.attr('transform', 'translate(-240 220)').and(airplaneTransitionGroups[0].outer.attr('transform', 'translate(1060 200)', 12000, 'linear'))),
                        25.5: setTime(19, 27).and(greenClockAreas[3].style('opacity', 0.6, 11400, 'linear')).and(togglePlane(0, 1, 3000)),
                        34: clockContainer.attr('class', 'clock-container clock-container-moved').attr('transform', 'translate(350, -330)', 1500),
                        35: setTime(19, 29, 0).and(bombsCounter.style('display', 'inline')).and(bombsCounterLabel.style('display', 'block')).and(togglePlane(0, 0, 1000)),
                        36: bombsCounter.text('400').and(setTime(19, 29, 1)).and(cloud.style('opacity', 0.4, 16000)).and(removeCircle(circles[0])),
                        37: bombsCounter.text('800').and(setTime(19, 29, 2)),
                        38: bombsCounter.text('1200').and(setTime(19, 29, 3)).and(removeCircle(circles[2])),
                        39: bombsCounter.text('1600').and(setTime(19, 29, 4)),
                        40: bombsCounter.text('2000').and(setTime(19, 29, 5)).and(removeCircle(circles[3])),
                        41: redClockArea.style('opacity', 0.6, 4000).and(redClockArea2.style('opacity', 0.6, 8000)).and(setTime(19, 55, undefined, 8000, 'linear')).and(updateOdometer(3500, '245029')).and(bombsCounter.text('245029')).and(scaleCircle(circles[5], 1.5)),
                        42: scaleCircle(circles[6], 1.75),
                        43: scaleCircle(circles[7], 1.25),
                        44: modifyCircleColor(circles[1], '#FF0000'),
                        45: modifyCircleColor(circles[4], '#FF0000'),
                        56: imgs['feuersturm'].style('opacity', 1, 1000),
                        60: imgs['hotel'].style('opacity', 1, 300).and(imgs['feuersturm'].style('opacity', 0, 1000)),
                        65: imgs['hbf'].style('opacity', 1, 300).and(imgs['hotel'].style('opacity', 0, 1000)).and(function () {
                            var promise = $timeout(function () {
                                scope.showEndscreen = true;
                            }, 4000);
                            this.setUndo(function () {
                                $timeout.cancel(promise);
                                scope.showEndscreen = false;
                                scope.showBombsInteractive = false;
                            })
                        })
                    });

                    var talkie = Talkie.timeline("#audio-container audio", scope.timelineDef);
                    scope.$on('$destroy', function () {
                        talkie.destroy();
                    })
                }, 250);
            }
        }
    });
})(angular);