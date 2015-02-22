self.port.on('inject', function() {
    elements = document.getElementsByTagName('a');
    for(var i = 0; i < elements.length; i++) {
        var e = elements[i]; // closures bruh
        elements[i].onclick = function() {
            self.port.emit('linkClicked', {
                'source': window.location.href,
                'destination': e.href
            });
        };
    }
});
