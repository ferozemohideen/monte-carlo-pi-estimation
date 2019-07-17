d3.select("div#chart")
  .append("div")
  // Container class to make it responsive.
  .classed("svg-container", true)
  .append("svg")
  // Responsive SVG needs these 2 attributes and no width and height attr.
  //.attr("preserveAspectRatio", "xMinYMin meet")
  .attr("width", "400")
  .attr("height", "400")
  // Class to make it responsive.
  .classed("svg-content-responsive", true)
  // Fill with a rectangle for visualization.
  .append("rect")
  .classed("rect", true)
  .attr("width", "100%")
  .attr("height", "100%");

d3.select('svg')
  .append("circle")
  .classed("big-circle", true)
  .attr("cx", 200)
  .attr("cy", 200)
  .attr("r", 200);

d3.select('.svg-container')
  .append("div")
  .classed("button-container", true);

var add_circle_button = d3.select(".button-container").append("button");
add_circle_button.text("submit");

var pi_value = d3.select(".button-container").append("p");
pi_value.text("None yet");

var center = [200, 200];

var incircle = 0;
var outcircle = 0;

var estimates = [];

// line chart stuff
var width = 400;
var height = 400;

var margin = { top: 20, right: 20, bottom: 20, left: 50 };

var svgline = d3.select(".svg-container").append("svg")
  .attr("height", height).attr("width", width)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

var xScale = d3.scale.linear()
  .range([0, width - margin.left - margin.right])

var yScale = d3.scale.linear()
  .range([height - margin.top - margin.bottom, 0])

var line = d3.svg.line().interpolate("monotone")
  .x(function (d) { return xScale(d.x); })
  .y(function (d) { return yScale(d.y); })

function render() {
  var data = estimates.map(function(item, index){ return {x: index, y: item};});
  console.log(data);

  var yMin = 0
  var yMax = Math.max(estimates);

  yScale.domain([yMin, yMax]);

  var yAxis = d3.svg.axis().scale(yScale).orient("left");

  svgline.selectAll(".y.axis").remove();

  svgline.append("g").attr("class", "y axis").call(yAxis);

  svgline.selectAll(".line").remove();

  var lines = svgline.selectAll(".line").data(data).attr("class", "line");

  lines.enter().append("path")
    .attr("class", "line")
    .attr("d", line).style("stroke", "blue");
}

(function () {
  var svg = d3.select('svg');
  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function drawCircle(x, y, size) {
    console.log('Drawing circle at', x, y, size);
    x_adj = x - center[0];
    y_adj = center[1] - y;
    var distance = Math.sqrt(Math.pow(x_adj, 2) + Math.pow(y_adj, 2)) / center[0];
    console.log('Distance = ', distance);
    if (distance <= 1) {
      var temp = svg.append("circle").attr('class', 'click-circle-blue').attr("cx", x).attr("cy", y);
      incircle += 1;
    }
    else {
      var temp = svg.append("circle").attr('class', 'click-circle-red').attr("cx", x).attr("cy", y);
      outcircle += 1;
    }
    temp.transition().duration(500).attr("r", 10).transition(250).attr("r", 2);
    var new_estimate = (incircle / (incircle + outcircle));
    pi_value.text(new_estimate);
    estimates.push(new_estimate);
    render();
  }

  add_circle_button.on('click', function () {
    var coords = [getRandom(0, 400), getRandom(0, 400)];
    console.log(coords);
    drawCircle(coords[0], coords[1], 2);
  });


})();