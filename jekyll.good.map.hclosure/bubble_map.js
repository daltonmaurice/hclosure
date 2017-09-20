    var width = 960,
       height = 600,
       active = d3.select(null);


var div = d3.select("div#map").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

var svg = d3.select("div#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("margin", "10px auto")
    .on("click", stopped, true);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", reset);

var projection = d3.geo.albersUsa()
    .scale(1280)
    .translate([width / 2, height / 2]);

var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .on("zoom", zoomed);



var path = d3.geo.path().projection(projection);

var g=svg.append("g");

   svg
    .call(zoom) // delete this line to disable free zooming
    .call(zoom.event);

var radius = d3.scale.sqrt()
    .domain([-.1,.08])
    .range([1, 100]);

var radius_neg = d3.scale.sqrt()
    .domain([-.1,-.00001])
    .range([15, 0]);

var radius_pos = d3.scale.sqrt()
    .domain([.00001,.05])
    .range([0, 15]);




//Reading map file and data

queue()
    .defer(d3.json, "hrr.json")
    .defer(d3.csv, "hosp_latlong_iv.csv")
    .await(ready);

//Start of Choropleth drawing

function ready(error, hrr,closehosp ) {
    var ivvar={};
    var rateById = {};
    var nameById = {};
    var hname = {};
    var hcity = {};
    var haddress = {};

    if(error) { console.log(error); }


    console.log(closehosp[0])



    closehosp.forEach(function(d) {
         lat=+d.lat;
         lon=+d.lon;
         hname[d.id] = d.name;
         hcity[d.id] = d.city;
         haddress[d.id] = d.address;
         ivvar[d.id]=+d.iv;  
});


//Drawing Choropleth
    
        g.attr("class", "hrr")
         .selectAll("path")    
         .data(topojson.feature(hrr, hrr.objects.hrr).features) 
         .enter().append("path")
         .attr("d", path)
         .style("opacity", .4)
         .on("click", clicked)
       //Adding mouseevents
        .on("mouseover", function(d) {
            d3.select(this).transition().duration(300).style("opacity", .8);
            div.transition().duration(300)
                .style("opacity", .8)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY -30) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition().duration(300)
                .style("opacity", 0.4);
            div.transition().duration(300)
                .style("opacity", .6);
})


g.append("path")
         .datum(topojson.mesh(hrr, hrr.objects.state, function(a, b) { return a !== b; }))
         .attr("class", "states")
         .attr("d", path)

// https://stackoverflow.com/questions/20004063/how-to-display-d3-bubbles-in-different-colors-for-a-dataset-with-one-branch-and

g.append("g")
 .attr("class","bubble")
 .selectAll("circle")
 .data(closehosp)
 .enter().append("circle")
 .attr("r", function(d) {
              if (ivvar[d.id] <0) { return radius_neg(ivvar[d.id])}
              else if (ivvar[d.id] >0) { return radius_pos(ivvar[d.id])}
                    
        else  { return  .6}
;})
 .style("fill", function(d) {
            if (ivvar[d.id] < 0) {return "red" }
            else if (ivvar[d.id] > 0) {return "green" }
            else  {return "yellow" }
        ;})
 .attr("transform", function(d) {
  return "translate(" + projection([
      d.lon,
      d.lat ]) + ")";
})
    .on("mouseover", function(d) {
            d3.select(this).transition().duration(300).style("opacity", .8);
            div.transition().duration(300)
  .style("opacity", 1)           
  div.text( "Hospital name :" + hname[d.id] + " : "+ haddress[d.id]  + hcity[d.id] + ": iv if closed:"+ ivvar[d.id])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY -30) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition().duration(300)
                .style("opacity", 0.8);
            div.transition().duration(300)
                .style("opacity", 0);
        })

  
    

}; // <-- End of Choropleth drawing



function clicked(d) {
  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = .9 / Math.max(dx / width, dy / height),
      translate = [width / 2 - scale * x, height / 2 - scale * y];

  svg.transition()
      .duration(750)
      .call(zoom.translate(translate).scale(scale).event);
}

function reset() {
  active.classed("active", false);
  active = d3.select(null);

  svg.transition()
      .duration(750)
      .call(zoom.translate([0, 0]).scale(1).event);
}

function zoomed() {
  g.style("stroke-width", 1.5 / d3.event.scale + "px");
  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}


var legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (width - 50) + "," + (height - 20) + ")")
  .selectAll("g")
    .data([-.07, -.02, -.002])
    .enter().append("g");

legend.append("circle")
    .attr("cy", function(d) { return -radius_neg(d); })
    .attr("r", radius);

legend.append("text")
    .attr("y", function(d) { return -2 * radius(d); })
    .attr("dy", "1.3em")
    .text(d3.format(".3s"));    


// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}
