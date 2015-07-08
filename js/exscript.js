function parse_script(script) {
	// for each line
	script.split(/\n/).forEach(function(line) {
		// process comments
		if (/#/.test(line)) {
			line = /#/.test(line) ? line.slice(0, line.indexOf("#")) : line;
		}
		// for each token
		line.split(/ /).forEach(function(token) {
			// process time
			)
		});
	});
}