var tabs = require('sdk/tabs');
//var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");
var sidebar = require("sdk/ui/sidebar");

var visitsToTab = [];


sidebar.Sidebar({
	id: 'my-sidebar',
	title: 'HIZTORY',
	url: "./sidebar.html",
	onShow: function () {
		console.log("showing!!");
	},
	onAttach: function (worker) {
		worker.port.on("ready", function() {
			for (var i=0; i<tabs.length; i++) {
				graphData.nodes.push({
					name: tabs[i].title, 
					index: i
				});
			}
			worker.port.emit("tabs", graphData);
		});
		
		worker.port.on("switch-tab", function (index) {
			tabs[index].activate();
			console.log("switching to tab ", tabs[index].title);
		});
	}
});

// Add page tracker
pageMod.PageMod({
	include: "*",
	contentScriptFile: "./tracker.js",
	onAttach: function (worker) {
		// Add visit to table
		myTabs.push(worker);
		worker.port.on("visit", function (document){
			visitsToTab.push(worker.tab);
			visitsToTab.length
			console.log("visit "+visitsToTab.length+" to tab "+worker.tab.index+": "+document.referrer+" -> "+document.URL);
		});
	}
});

// Listen for tab openings.
/*tabs.on('open', function (tab) {
	var worker = tab.attach({
		contentScriptFile: "./tracker.js",
		onAttach: function (worker) {
			worker.port.on("visit", function (document){
				console.log("tab "+tab.index+": "+document.referrer+" -> "+document.URL);
			});
		}
		//myOpenTabs.push(tab);
	});
});*/

// Listen for tab closings.
tabs.on('close', function (tab) {
	for(var i = myTabs.length - 1; i >= 0; i--) {
		if(myTabs[i]
});



// Listen for tab content loads.
tabs.on('ready', function(tab) {
	//console.log('tab is loaded', tab.title, tab.url);
});
