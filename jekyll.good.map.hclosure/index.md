---
layout: default
base-url: /hclose/
---

{% assign lvl = page.url | append:'X' | split:'/' | size %}
{% capture relative %}{% for i in (3..lvl) %}../{% endfor %}{% endcapture %}

<link href="{{ relative }}css/main.css" rel="stylesheet" />
<script src="{{ relative }}scripts/jquery.js"></script>


<style>
.states {
  fill: none;
  stroke: black;
  stroke-linejoin: round;
}

.background {
  fill: none;
  pointer-events: all;
}

.bubble {
  fill: red; 
  fill-opacity: .5;
  stroke: black;
  stroke-width: .1px;
}

 
.feature {
  fill: #ccc;
  cursor: pointer;
}

.feature.active {
  fill: orange;
}


.body {
  font-family: Arial, sans-serif;
}


.legend circle {
  fill: none;
  stroke: #ccc;
}

.legend text {
  fill: #777;
  font: 10px sans-serif;
  text-anchor: middle;
}
div.tooltip {   
  position: absolute;           
  text-align: center;           
  width: 250px;                  
  height: 50px;                 
  padding: 2px;             
    font-size: 10px;     
    background: #FFFFE0;
    border: 1px;      
    border-radius: 8px;           
    pointer-events: none;         
}        
</style>


<script src="//d3js.org/d3.v3.min.js"></script>
<script src="//d3js.org/queue.v1.min.js"></script>
<script src="//d3js.org/topojson.v1.min.js"></script>


##  How do hospital closures impact patient?
We map all hospitals in our AMI sample (yellow dots). In addition we map the hospitals that closed in out sample and plot a bubble relative to the size of our IV estimate. Note that IV which are negative (a worse hospital closed in the zip code) are color coded as red. The magnitude is graphed as red. 

Since the IV is defined for zip-hospital pairs. I simply report the zipcode in which the hospital had the largest impact. 
<div id="map"></div>



### Initial hospital closure file - 09/20/2017

[download the hospital closure packet-20Sep2017](hospital_closure20Sep2017.zip)



<script src="bubble_map.js"></script>




