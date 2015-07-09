function process_time(token) {
	var seconds = 0;
	var subtokens = token.split(":");
	switch(subtokens.length) {
		case 1:
			seconds += parseInt(subtokens[0]);
			break;
		case 2:
			seconds += parseInt(subtokens[0]) * 60;
			seconds += parseInt(subtokens[1]);
			break;
		case 3:
			seconds += parseInt(subtokens[0]) * 60 * 60;
			seconds += parseInt(subtokens[1]) * 60;
			seconds += parseInt(subtokens[2]);
			break;
		default:
			seconds = -1;
	}
	return seconds;
}

function parse_exscript(script) {
	var commands = [];
	// for each line
	script.split(/[\n;]/).forEach(function(line) {
		var command = { "loops": 1 };
		// process comments
		if (/#/.test(line)) {
			line = /#/.test(line) ? line.slice(0, line.indexOf("#")) : line;
		}
		// for each token
		line.split(/ /).forEach(function(token) {
			// process range
			if (/^\s*[\d:-]+\s*$/.test(token)) {
				var time1 = -1;
				var time2 = -1;
				var subtokens = token.split("-");
				switch(subtokens.length) {
					case 1:
						time1 = process_time(subtokens[0]);
						break;
					case 2:
						time1 = process_time(subtokens[0]);
						time2 = process_time(subtokens[1]);
						break;
				}
				command.time1 = time1;
				command.time2 = time2;
			}
			// process loops
			else if (/^\s*\d+[xX]\s*$/.test(token)) {
				command.loops = parseInt(token.slice(0, token.length - 1));
			} 
			// process speed
			else if (/^\s*\d+%\s*$/.test(token)) {
				command.speed = parseInt(token.slice(0, token.length - 1)) / 100.0;
			} 
		});
		commands.push(command);
	});
	return commands;
}

function eval_exscript(commands, video) {
	console.log(commands);
	video.currentTime = commands[0].time1;
	video.playbackRate = commands[0].speed;
	var interval = setInterval(function() {
		if (video.currentTime > commands[0].time2) {
			console.log(commands[0].loops);
			if (--(commands[0].loops) > 0) {
				video.currentTime = commands[0].time1;
			}
			else {
				commands.shift();
				if (commands.length === 0) {
					clearInterval(interval);
				} else {
					video.currentTime = commands[0].time1;
					console.log("done");
				}
			}
		}
	}, 250);
}


