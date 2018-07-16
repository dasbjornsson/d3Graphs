var n = 40,
    duration = 750,
    now = new Date(Date.now() - duration),
    random = d3.random.normal(0, 0.2),
    count = 0,
    data = d3.range(n).map(random);

var margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 40
},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x = d3.time.scale()
    .domain([now - (n - 2) * duration, now - duration])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([height, 0]);



var line = d3.svg.line()
    .interpolate("basis")
    .x(function (d, i) {
    return x(now - (n - 1 - i) * duration);
})
    .y(function (d, i) {
    return y(d);
});

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

var axis = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(x.axis = d3.svg.axis().scale(x).orient("bottom"));

var yAx = svg.append("g")
    .attr("class", "y axis")
    .call(y.axis = d3.svg.axis().scale(y).orient("left"));

var path = svg.append("g")
    .attr("clip-path", "url(#clip)")
    .append("path")
    .datum(data)
    .attr("class", "line");


var transition = d3.select({}).transition()
    .duration(750)
    .ease("linear");

tick();

function tick() {
    transition = transition.each(function () {

        // update the domains
        now = new Date();
        x.domain([now - (n - 2) * duration, now - duration]);
        y.domain([0, d3.max(data) + 10]);


        // push a new data point onto the back
        data.push(20 + Math.random() * 100);

        // redraw the line, and slide it to the left
        path.attr("d", line)
            .attr("transform", null);

        // slide the x-axis left, rescale the y-axis
        axis.call(x.axis);
        yAx.call(y.axis);

        // slide the line left
        path.transition()
            .attr("transform", "translate(" + x(now - (n - 1) * duration) + ")");

        // pop the old data point off the front
        data.shift();
    }).transition().each("start", tick);
}