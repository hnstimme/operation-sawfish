(function (angular) {
    'use strict';
    angular.module('app').directive('bombing', function () {
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
                    animate = Talkie.animate(svg);

                d3.select(svg).attr('height', document.body.offsetHeight - 140);

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

                    var timeline = Talkie.timeline("#controls", {
                        92: airplaneTransitionGroups[0].attr('transform', 'translate(-300 0)', 4000),
                        95.5: bomb7.style('opacity', 1, 500),
                        95.6: bomb7.attr('transform', 'translate(600, 420)', 2000),
                        97.4: circleGroups['green-1'].style('opacity', 1, 300),
                        98.2: circleGroups['green-2'].style('opacity', 1, 300),
                        97: circleGroups['green-3'].style('opacity', 1, 300),
                        97.8: circleGroups['green-4'].style('opacity', 1, 300),
                        97.5: bomb7.style('opacity', 0, 1000),
                        99: airplaneTransitionGroups[0].attr('transform', 'translate(6000 0)', 3000),
                        99.5: airplaneTransitionGroups[1].attr('transform', 'translate(-300 0)', 2000),
                        100: airplaneTransitionGroups[2].attr('transform', 'translate(600 -150)', 2000),
                        100.5: airplaneTransitionGroups[3].attr('transform', 'translate(1200 50)', 2000),
                        101: airplaneTransitionGroups[4].attr('transform', 'translate(2000 -100)', 2000),
                        103: christbaumGroups[1].style('opacity', 1, 300),
                        103.2: christbaumGroups[2].style('opacity', 1, 300),
                        103.4: christbaumGroups[3].style('opacity', 1, 300),
                        103.6: christbaumGroups[4].style('opacity', 1, 300),
                        103.8: christbaumGroups[5].style('opacity', 1, 300),
                        104: christbaumGroups[6].style('opacity', 1, 300),
                        103.5: christbaumGroups[1].attr('transform', 'translate(30, 150)', 5000),
                        103.7: christbaumGroups[2].attr('transform', 'translate(200, 190)', 5000),
                        103.9: christbaumGroups[3].attr('transform', 'translate(320, 120)', 5000),
                        104.1: christbaumGroups[4].attr('transform', 'translate(470, 170)', 5000),
                        104.3: christbaumGroups[5].attr('transform', 'translate(640, 160)', 5000),
                        104.5: christbaumGroups[6].attr('transform', 'translate(785, 230)', 5000),
                        108.5: christbaumGroups[1].style('opacity', 0, 300),
                        108.7: christbaumGroups[2].style('opacity', 0, 300),
                        108.9: christbaumGroups[3].style('opacity', 0, 300),
                        109.1: christbaumGroups[4].style('opacity', 0, 300),
                        109.4: christbaumGroups[5].style('opacity', 0, 300),
                        109.5: christbaumGroups[6].style('opacity', 0, 300),
                        106: airplaneTransitionGroups[4].attr('transform', 'translate(6000 0)', 3000),
                        106.4: airplaneTransitionGroups[3].attr('transform', 'translate(6000 0)', 3000),
                        106.8: airplaneTransitionGroups[2].attr('transform', 'translate(6000 0)', 3000),
                        107.2: airplaneTransitionGroups[1].attr('transform', 'translate(6000 0)', 3000),
                        109: mosquitoTransitionGroups[0].attr('transform', 'translate(400 70)', 2000),
                        110: mosquitoTransitionGroups[1].attr('transform', 'translate(600 20)', 2000),
                        111: mosquitoTransitionGroups[2].attr('transform', 'translate(800 100)', 2000),
                        113.5: mosquitoTransitionGroups[3].attr('transform', 'translate(1000 40)', 2000),
                        111.2: circleGroups['red-1'].style('opacity', 1, 300),
                        112: circleGroups['red-2'].style('opacity', 1, 300),
                        113: circleGroups['red-3'].style('opacity', 1, 300),
                        115: circleGroups['yellow-1'].style('opacity', 1, 300),
                        115.5: mosquitoTransitionGroups[0].attr('transform', 'translate(3400 70)', 3000),
                        115.9: mosquitoTransitionGroups[1].attr('transform', 'translate(3600 20)', 3000),
                        116.5: mosquitoTransitionGroups[2].attr('transform', 'translate(3800 100)', 3000),
                        117: mosquitoTransitionGroups[3].attr('transform', 'translate(31000 40)', 3000),
                        115.1: airplaneTransitionGroups[0].attr('transform', 'translate(-3000 0)'),
                        116: airplaneTransitionGroups[0].attr('transform', 'translate(-300 0)', 2000)
                    });
                    Talkie.ui.playButton("#wrapper", timeline);
                }, 500);
            }
        }
    });
})(angular);