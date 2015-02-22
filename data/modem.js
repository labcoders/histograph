console.log('modem.js loaded');

function startD3(graphData) {
    console.log('d3 code started');

    var URLs = graphData.URLs, links = graphData.links;

    for (let i = 0; i < URLs.length; i++) {
        console.log(URLs[i].address);
    }

    var myWidth = 500
      , myHeight = 500;

    var color = d3.scale.category20();

    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(60)
        .size([myWidth, myHeight]);

    force.nodes(URLs)
        .links(links)
        .start();

    var svg = d3.select('body')
        .append('svg')
        .attr('width', myWidth)
        .attr('height', myHeight);
    
    // build the arrow.
    svg.append("svg:defs").selectAll("marker")
        .data(["end"])      // Different link/path types can be defined here
      .enter().append("svg:marker")    // This section adds in the arrows
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

    var link = svg.selectAll(".link")
        .data(links)
        .enter()
        .append('svg:line')
        .attr('class', 'link')
        .attr('marker-end', 'url(#end)');

    var node = svg.selectAll(".node")
        .data(URLs)
        .enter()
        .append('g')
        .attr('class', 'node')
        .call(force.drag);

    node.append('circle')
        .attr('r', 8)
        .style('fill', 'red');

    // add the links and the arrows
    force.on('tick', function() {
        link.attr('x1', function(d) {
            return d.source.x;
        }).attr('y1', function(d) {
            return d.source.y;
        }).attr('x2', function(d) {
            return d.target.x;
        }).attr('y2', function(d) {
            return d.target.y;
        });

        d3.selectAll('circle')
            .attr('cx', function(d) {
                return d.x;
            }).attr('cy', function(d) {
                return d.y;
            });
    });
}

self.port.on('graph-data', function(gd) {
    console.log('got graph data');
    startD3(gd);
});
