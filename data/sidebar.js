
addon.port.emit("ready");

var width = 300;
var height = 600;

var graphData = {nodes:[], links:[]};

var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height);

var force = d3.layout.force()
	.gravity(.05)
	.distance(100)
	.charge(-100)
	.size([width, height])
	.nodes(graphData.nodes)
	.links(graphData.links)
	.start();

addon.port.on("graph-add", function(data) {
	//setSidebarWidth(width);
	
	var link = svg.selectAll(".link")
		.data(json.links)
		.enter().append("line")
		.attr("class", "link");

	var node = svg.selectAll(".node")
		.data(data.nodes)
		.enter().append("g")
		.attr("class", "node")
		.call(force.drag)
		.on("click", function (d) {
			addon.port.emit("switch-tab", d.index);
		});

	node.append("image")
		.attr("xlink:href", "https://github.com/favicon.ico")
		.attr("x", -8)
		.attr("y", -8)
		.attr("width", 16)
		.attr("height", 16);

	node.append("text")
		.attr("dx", 12)
		.attr("dy", ".35em")
		.text(function(d) { return d.name });

	force.on("tick", function() {
		link.attr("x1", function(d) { return d.source.x; })
		    .attr("y1", function(d) { return d.source.y; })
		    .attr("x2", function(d) { return d.target.x; })
		    .attr("y2", function(d) { return d.target.y; });
		node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	});
});
addon.port.on("graph-refresh", function(data) {
	force.start();
});


/*
function setSidebarWidth(newwidth) {
  window.top.document.getElementById("sidebar-box").width=newwidth;
}*/
