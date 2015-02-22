
addon.port.emit("ready");

var width = 250;
var height = 600;

var graphData = {nodes:[], links:[]};

var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height);

var force = d3.layout.force()
	//.gravity(.05)
	.distance(60)
	.charge(-120)
	.size([width, height])
	.nodes(graphData.nodes)
	.links(graphData.links)
	.start();
/*var link = svg.selectAll(".link")
	.data(graphData.links)
	.enter().append("line")
	.attr("class", "link");*/

svg.append("svg:defs").selectAll("marker")
	.data(["end"]) // Different link/path types can be defined here
	.enter().append("svg:marker") // This section adds in the arrows
	.attr("id", String)
	//.attr("markerUnits", "strokeWidth")
	.attr("viewBox", "0 0 10 10")
	.attr("refX", "18")
	.attr("refY", "5")
	.attr("markerWidth", 6)
	.attr("markerHeight", 6)
	.attr("orient", "auto")
	.append("svg:path")
	.attr("d", "M 0 0 L 10 5 L 0 10 z");
	
	
force.on("tick", function() {
	svg.selectAll(".link").attr("x1", function(d) { return d.source.x; })
	    .attr("y1", function(d) { return d.source.y; })
	    .attr("x2", function(d) { return d.target.x; })
	    .attr("y2", function(d) { return d.target.y; });
	svg.selectAll(".node").attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
});

//setSidebarWidth(width);

addon.port.on("graph-add", function(data) {
	console.log("graph-add("+JSON.stringify(data)+")");
	
	graphData.nodes.push({
		name: data.name,
		which: data.which,
		icon: data.favicon,
		link: data.link
	});
	
	for (var i=0; i<graphData.nodes.length-1; i++) { // dont check last one just added
		if (graphData.nodes[i].link.url == data.link.referrer) { // found!
			console.log("omg found! source: "+i+", target: "+(graphData.nodes.length-1));
			graphData.links.push({
				source: graphData.nodes[i],
				target: graphData.nodes[graphData.nodes.length-1]
			});
			break;
		}
	}
});
addon.port.on("graph-refresh", function() {
	console.log("graph-refresh");
	
	var link = svg.selectAll(".link")
		.data(graphData.links)
		.enter()
		.append('svg:line')
		.attr('class', 'link')
		.attr('marker-end', 'url(#end)');
	
	var node = svg.selectAll(".node")
		.data(graphData.nodes)
		.enter().append("g")
		.attr("class", "node")
		.call(force.drag)
		.on("click", function (d) {
			addon.port.emit("switch-tab", d.which);
		});

	node.append("image")
		.attr("xlink:href", function (d) { return d.icon })
		.attr("x", -8)
		.attr("y", -8)
		.attr("width", 16)
		.attr("height", 16);

	node.append("text")
		.attr("dx", 12)
		.attr("dy", ".35em")
		.text(function(d) { return d.name });
		
		/*d3.selectAll('.node')
			.attr('x', function(d) {
				return d.x;
			}).attr('y', function(d) {
				return d.y;
			});*/
		
	force.start();
});


/*
function setSidebarWidth(newwidth) {
  window.top.document.getElementById("sidebar-box").width=newwidth;
}*/
