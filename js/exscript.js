/**
 * Convert the time token into seconds.
 * The token may specify seconds up to the number of hours.
 * 
 * @param {string} the time
 * @return {number} the number of seconds
 */
function process_time(token) {
	var seconds = 0;
	// split
	var subtokens = token.split(":").map(function(e) {
		// convert empty strings to 0
		return e === "" ? 0 : e;
	});
	console.log("process_time > " + subtokens);
	// only convert up to hours
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
	}
	return seconds;
}

/**
 * Validate the command object.
 * Command object is valid if not undefined and time range is positive.
 * 
 * @param {object} the command object
 * @return {boolean} the result: true = valid, false = invalid
 */
function is_valid_command(command) {
	var is_valid = false;
	if ((command !== undefined) &&
		("time1" in command && "time2" in command) &&
		(command.time1 < command.time2)) {
		is_valid = true;
	}
	return is_valid;
}

/**
 * Parse the script into a stack of valid command objects.
 * 
 * @param {string} the script
 * @return {array} the stack of command objects
 */
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
				if (subtokens.length === 2) {
					command.time1 = process_time(subtokens[0]);
					command.time2 = process_time(subtokens[1]);
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
		if (is_valid_command(command)) {
			command.speed = ("speed" in command) ? command.speed : 1;
			command.loops = ("loops" in command) ? command.loops : 1;
			console.log("parse_exscript > command: " + JSON.stringify(command));
			commands.push(command);
		}
	});
	return commands;
}

// the thread that executes the script
var eval_interval = false;

/**
 * Execute the command object stack.
 * 
 * @param {array} the stack of command objects
 * @param {tag} the HTML5 video tag
 * @return {interval} the execution thread
 */
function exec_exscript(commands, video) {
	// update video properties
	video.currentTime = commands[0].time1;
	video.playbackRate = commands[0].speed;
	eval_interval = setInterval(function() {
		// process video state
		if (video.currentTime > commands[0].time2) {
			console.log("exec_exscript > loop " + commands[0].loops + " complete!");
			// check additional loops
			if (--(commands[0].loops) > 0) {
				// loop!
				video.currentTime = commands[0].time1;
			}
			// no more loops for current command object
			else {
				// remove command object
				commands.shift();
				// check additional command objects
				if (commands.length === 0) {
					console.log("exec_exscript > done");
					// done!
					exec_clear();
					video.playbackRate = 1;
				} else {
					// update video properties
					video.currentTime = commands[0].time1;
					video.playbackRate = commands[0].speed;
				}
			}
		}
	}, 250);
	return eval_interval;
}

/**
 * Clear execution thread.
 *
 * @return {interval} the execution thread
 */
function exec_clear() {
	clearInterval(eval_interval);
	eval_interval = false;
}


