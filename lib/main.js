var tabs = require('sdk/tabs');
var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");
var buttons = require("sdk/ui/button/action");

URLs = []; // the nodes in our graph
links = []; // the edges, as {source:, dest:} pairs of indices in URLs.

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

buttons.ActionButton({
    id: "open-histograph",
    label: "Histograph",
    icon: {
        "16": "./16.png"
    },
    onClick: function(state) {
        console.log('button clicked');
        tabs.open({
            url: data.url('./index.html'),
            onLoad: function(tab) {
                worker = tab.attach({
                    contentScriptFile: ['./d3.min.js', './modem.js']
                });
                console.log('attached modem.js');
                worker.port.emit('graph-data', {
                    URLs: URLs,
                    links: links
                });
            }
        });
    }
});

// source and dest are *indices of URLs*.
function Link(source, target) {
    this.equals = function(that) {
        return this.source == that.source && this.target == that.target;
    }

    // INDICES DUDE
    this.source = source;
    this.target = target;
    this.count = 1; // how many times this link has been traversed
}

// Look up the index of the given URL.
function lookupURL(url) {
    for(var i = 0; i < URLs.length; i++)
        if(url == URLs[i].address)
            return i;
    return -1;
}

// Add a URL to the URL list, and return its index.
// If the URL already exists in the list, then increment its count.
function addURL(url) {
    for(var i = 0; i < URLs.length; i++)
        if(url == URLs[i].address) {
            URLs[i].count += 1;
            return i;
        }

    URLs.push({
        address: url,
        count: 1,
        index: URLs.length
    });

    return URLs.length - 1; // index of inserted element
}

// Look up the index of the given link, compared on the basis of its
// source and destination *indices.
function lookupLink(link) {
    for(var i = 0; i < links.length; i++) {
        if(links[i].equals(link)) {
            return i;
        }
    }
    return -1;
}

// Add a link. If the link already exists in the list, compared on the basis of
// its source and destination, then increment its count by one.
// Return the index of the link added or found.
function addLink(link) {
    for(var i = 0; i < links.length; i++) {
        if(links[i].equals(link)) {
            links[i].count += 1;
            return i;
        }
    }
    links.push(new Link(link.source, link.target));
    return links.length - 1;
}

function resetGraph() {
    console.log('graph reset');
}

// Add page tracker
pageMod.PageMod({
	include: "*",
	contentScriptFile: "./tracker.js",
	onAttach: function (worker) {
		// Add visit to table
		worker.port.on("visit", function (linkData){
            var hasReferrer = false, hasAddress = false;

            if(linkData.referrer) {
                source = addURL(linkData.referrer);
                hasReferrer = true;
            }

            if(linkData.address) {
                target = addURL(linkData.address);
                hasAddress = true;
            }

            // if the user has indeed clicked on a link from a "real" page
            // to another "real" page, then they have both an address and
            // a referrer, so we can add that link to the links list.
            if(hasAddress && hasReferrer)
                links.push(new Link(source, target));

            resetGraph();
		});
	}
});
