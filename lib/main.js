var tabs = require("sdk/tabs");
var d3 = require("d3.v3.min.js");
var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;

let { search } = require("sdk/places/history");

var links = []

pageMod.PageMod({
    include: "*",
    contentScriptFile: data.url('element-getter.js'),
    onAttach: function(worker) {
        worker.port.emit('inject');
        console.log('attached worker');
        worker.port.on('linkClicked', function(link) {
            links.push(link);
            console.log("added link ", link.source,
                    " -> ", link.destination);
        });
    }
});

function getHistory(callback) {
    search({
        query: '/'
    }).on("end", callback);
}


