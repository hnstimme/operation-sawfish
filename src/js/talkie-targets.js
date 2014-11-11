(function (d3, talkies) {
    var width = 500;
    var height = 500;

    var svg = d3.select("#container").append("svg")
        .attr("width", width + 200)
        .attr("height", height + 200);
//
//    // Create a unit projection.
//    var projection = d3.geo.mercator()
//        .scale(1)
//        .translate([0, 0]);
//
//// Create a path generator.
//    var path = d3.geo.path()
//        .projection(projection);
//
//// Compute the bounds of a feature of interest, then derive scale & translate.
//    var b = path.bounds(state),
//        s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
//        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    d3.json("data/world.topo.json", function (error, world) {
        var json = topojson.feature(world, world.objects.countries);
        var matching = json.features.filter(function (feature) {
            return feature.properties.name === "Germany";
        });
        var germany = matching[0];
        console.log(germany);
        console.log(json);
        // create a first guess for the projection
        var center = d3.geo.centroid(json);
        var scale = 150;
        var offset = [width / 2, height / 2];
        var projection = d3.geo.mercator().scale(scale).center(center)
            .translate(offset);

        // create the path
        var path = d3.geo.path().projection(projection);

        // using the path determine the bounds of the current map and use
        // these to determine better values for the scale and translation
        var bounds = path.bounds(germany);
        var hscale = scale * width / (bounds[1][0] - bounds[0][0]);
        var vscale = scale * height / (bounds[1][1] - bounds[0][1]);
        scale = (hscale < vscale) ? hscale : vscale;
        offset = [width - (bounds[0][0] + bounds[1][0]) / 2,
            height - (bounds[0][1] + bounds[1][1]) / 2];

        // new projection
        projection = d3.geo.mercator().center([9.13, 49.09])
            .scale(scale).translate(offset);
        path = path.projection(projection);

        // add a rectangle to see the bound of the svg
        svg.append("rect").attr('width', width).attr('height', height)
            .style('stroke', 'black').style('fill', 'none');

        svg.selectAll("path").data(json.features).enter().append("path")
            .attr("d", path)
            .style("fill", "red")
            .style("stroke-width", "1")
            .style("stroke", "black")
    });

//// Update the projection to use computed scale & translate.
//    projection
//        .scale(s)
//        .translate(t);

//    d3.select(window).on("resize", throttle);
//
//    var zoom = d3.behavior.zoom()
//        .scaleExtent([1, 1024])
//        .on("zoom", move);
//
//    var width = 600;
//    var height = 600;
//
//    var topo, projection, path, svg, g;
//
//    var tooltip = d3.select("#container").append("div").attr("class", "tooltip hidden");
//
//    setup(width, height);
//
//    function setup(width, height) {
//        projection = d3.geo.mercator()
//            .center([49.9, 9.1]).scale(1000).translate([0, 0]);
//
//        path = d3.geo.path()
//            .projection(projection);
//
//        svg = d3.select("#container").append("svg")
//            .attr("width", width)
//            .attr("height", height)
//            .append("g")
//            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
//            .call(zoom);
//
//        g = svg.append("g");
//
//    }
//
//    d3.json("data/world.topo.json", function (error, world) {
//
//        var countries = topojson.feature(world, world.objects.countries).features;
//
//        topo = countries;
//        draw(topo);
//
//    });
//
//    function draw(topo) {
//
//        var country = g.selectAll(".country").data(topo);
//
//        country.enter().insert("path")
//            .attr("class", "country")
//            .attr("d", path)
//            .attr("id", function (d, i) {
//                return d.id;
//            })
//            .attr("title", function (d, i) {
//                return d.properties.name;
//            })
//            .style("fill", function (d, i) {
//                return d.properties.color;
//            });
//
//        //ofsets plus width/height of transform, plsu 20 px of padding, plus 20 extra for tooltip offset off mouse
//        var offsetL = document.getElementById('container').offsetLeft + (width / 2) + 40;
//        var offsetT = document.getElementById('container').offsetTop + (height / 2) + 20;
//
//        //tooltips
//        country
//            .on("mousemove", function (d, i) {
//                var mouse = d3.mouse(svg.node()).map(function (d) {
//                    return parseInt(d);
//                });
//                tooltip
//                    .classed("hidden", false)
//                    .attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px")
//                    .html(d.properties.name)
//            })
//            .on("mouseout", function (d, i) {
//                tooltip.classed("hidden", true)
//            });
//
//    }
//
//    function redraw() {
//        width = document.getElementById('container').offsetWidth - 60;
//        height = width / 2;
//        d3.select('svg').remove();
//        setup(width, height);
//        draw(topo);
//    }
//
//    function move() {
//        var t = d3.event.translate;
//        var s = d3.event.scale;
//        moveIt(t, s);
//    }
//
//    function moveIt(t, s, animate) {
//        var h = height / 3;
//
//        if(t) zoom.translate(t);
//        g.style("stroke-width", 1 / s);
//        var elem = animate ? g.transition().duration(3000) : g;
//        if(t) elem.attr("transform", "translate(" + t + ")scale(" + s + ")");
//        else elem.attr("transform", "scale(" + s + ")");
//    }
//
//    var throttleTimer;
//
//    function throttle() {
//        window.clearTimeout(throttleTimer);
//        throttleTimer = window.setTimeout(function () {
//            redraw();
//        }, 200);
//    }
//
////    window.setTimeout(function () {
////        moveIt(null, 6, true);
////    }, 3000);
//
//    talkies['target'] = {
//        'start': null,
//        'stop': null,
//        'pause': null
//    }
})(d3, talkies);