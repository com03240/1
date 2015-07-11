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

function is_valid_command(command) {
	var is_valid = false;
	if ((command !== undefined) &&
		("time1" in command && "time2" in command) &&
		(command.time1 < command.time2)) {
		is_valid = true;
	}
	return is_valid;
}

function parse_exscript(script) {
	var commands = [];
	// for each line
	script.trim().split(/[\n;]/).forEach(function(line) {
		console.log("parse_exscript > line: " + line);
		var command = {};
		// process comments
		if (/#/.test(line)) {
			line = /#/.test(line) ? line.slice(0, line.indexOf("#")) : line;
		}
		// for each token
		line.split(/ /).forEach(function(token) {
		console.log("parse_exscript > token: " + token);
			// process range
			if (/^[\d:-]+$/.test(token)) {
				var subtokens = token.split("-");
				console.log("parse_exscript > subtokens: " + subtokens);
				switch(subtokens.length) {
					case 1:
						command.time1 = process_time(subtokens[0]);
						break;
					case 2:
						command.time1 = process_time(subtokens[0]);
						command.time2 = process_time(subtokens[1]);
						break;
				}
			}
			// process loops
			else if (/^\d+[xX]$/.test(token)) {
				command.loops = parseInt(token.slice(0, token.length - 1));
			} 
			// process speed
			else if (/^\d+%$/.test(token)) {
				command.speed = parseInt(token.slice(0, token.length - 1)) / 100.0;
			} 
		});
		console.log("parse_exscript > command: " + JSON.stringify(command));
		if (is_valid_command(command)) {
			commands.push(command);
		}
	});
	return commands;
}

function eval_exscript(commands, video) {
	console.log(commands);
	var interval = null;
	if (commands.length > 0) {
		video.play();
		// update video properties
		video.currentTime = commands[0].time1;
		video.playbackRate = commands[0].speed;
		interval = setInterval(function() {
			// process video state
			if (video.currentTime > commands[0].time2) {
				console.log(commands[0].loops);
				if (--(commands[0].loops) > 0) {
					video.currentTime = commands[0].time1;
				}
				else {
					commands.shift();
					if (commands.length === 0) {
						clearInterval(interval);
						console.log("eval_exscript > done");
					} else {
						// update video properties
						video.currentTime = commands[0].time1;
						video.playbackRate = commands[0].speed;
					}
				}
			}
		}, 250);
	}
	return interval;
}


