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
add_circle_button.text("single step");

var start_animation_button = d3.select(".button-container").append("button");
start_animation_button.text("start simulation");

var stop_animation_button = d3.select(".button-container").append("button");
stop_animation_button.text("stop simulation");

var pi_value = d3.select(".button-container").append("p");
pi_value.text("None yet");

var center = [200, 200];

var incircle = 0;
var outcircle = 0;

var estimates = [];

// line chart stuff
var width = 400;
var height = 400;

var margin = { top: 50, right: 20, bottom: 50, left: 20 };

var svgline = d3.select(".svg-container").append("svg")
  .attr("height", height).attr("width", width)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

var xScale = d3.scaleLinear()
  .range([0, width - margin.left - margin.right]);

var yScale = d3.scaleLinear()
  .range([height - margin.top - margin.bottom, 0]);

var xAxisCall = d3.axisBottom();
var yAxisCall = d3.axisLeft();

var plotLine = d3.line()
  .curve(d3.curveMonotoneX)
  .x(function (d) {
    return xScale(d.x);
  })
  .y(function (d) {
    return yScale(d.y);
  });

var line = svgline.append("g").append("path").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .datum(estimates)
  .attr("d", plotLine)
  .style("fill", "none")
  .style("stroke", "brown");

initAxis();
var max_estimate = -1;
function initAxis() {
  xScale.domain([0, 1]).range([0, width - (margin.top + margin.bottom)]);
  yScale.domain([0, 1]).range([height - (margin.top + margin.bottom), 0]);
  xAxisCall.scale(xScale);
  yAxisCall.scale(yScale);

  svgline.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + [margin.left, height - margin.top] + ")")
    .call(xAxisCall);
  svgline.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + [margin.left, margin.top] + ")")
    .call(yAxisCall);
}

function updateAxis(count) {
  xScale.domain([0, count]).range([0, width - (margin.top + margin.bottom)]);
  xAxisCall.scale(xScale);
  yScale.domain([0, max_estimate + 0.2]).range([height - (margin.top + margin.bottom), 0]);
  yAxisCall.scale(yScale);


  var t = d3.transition()
    .duration(500);

  line.datum(estimates.map(function (item, index) { return { x: index, y: item }; }))
    .transition(t)
    .attr("d", plotLine)
    .style("fill", "none")
    .style("stroke-width", "2px")
    .style("stroke", "red");

  svgline.select(".x")
    .transition(t)
    .call(xAxisCall);

  svgline.select(".y")
    .transition(t)
    .call(yAxisCall)

}


var svg = d3.select('svg');
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function drawCircle(x, y, size) {
  // console.log('Drawing circle at', x, y, size);
  x_adj = x - center[0];
  y_adj = center[1] - y;
  var distance = Math.sqrt(Math.pow(x_adj, 2) + Math.pow(y_adj, 2)) / center[0];
  // console.log('Distance = ', distance);
  if (distance <= 1) {
    var temp = svg.append("circle").attr('class', 'click-circle-blue').attr("cx", x).attr("cy", y);
    incircle += 1;
  }
  else {
    var temp = svg.append("circle").attr('class', 'click-circle-red').attr("cx", x).attr("cy", y);
    outcircle += 1;
  }
  temp.transition().duration(500).attr("r", 10).transition(250).attr("r", 2);
  var new_estimate = outcircle == 0 ? incircle : (incircle / outcircle);
  pi_value.text("Current Estimate of pi: " + new_estimate.toFixed(2));
  estimates.push(new_estimate);
  //render();
  if (new_estimate > max_estimate) {
    max_estimate = new_estimate;
  }
  updateAxis(estimates.length);
}

function step() {
  var coords = [getRandom(0, 400), getRandom(0, 400)];
  // console.log(coords);
  drawCircle(coords[0], coords[1], 2);
}

add_circle_button.on('click', function () {
  step();
});

var interval;
start_animation_button.on('click', function () {
  interval = setInterval(step, 10);
});

stop_animation_button.on('click', function() {
  clearInterval(interval);
})
