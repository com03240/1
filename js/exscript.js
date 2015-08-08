/**
 * The thread that executes the script...
 * @type {interval}
 */
var exec_interval = null;

/**
 * The currently executing script...
 * @type {array}
 */
var exec_script = [];

/**
 * Clear execution thread.
 */
function exec_clear() {
	clearInterval(exec_interval);
	exec_interval = null;
	exec_script = [];
}

/**
 * Execute the command object stack.
 * @param {array} the stack of command objects
 * @param {tag} the HTML5 video tag
 * @return {interval} the execution thread
 */
function exec_exscript(commands, video) {
	// current script
	exec_script = commands;
	// update video properties
	var duration = video.duration;
	video.currentTime = commands[0].time1;
	video.playbackRate = commands[0].rate;
	exec_interval = setInterval(function () {
			// process video state
			if (video.currentTime >= commands[0].time2) {
				// check additional reps
				if (--(commands[0].reps) > 0) {
					// loop!
					video.currentTime = commands[0].time1;
				}
				// no more reps for current command object
				else {
					// remove command object
					commands.shift();
					// check additional command objects
					if (commands.length === 0) {
						// done!
						exec_clear();
						video.playbackRate = 1;
					} else {
						// update video properties
						video.currentTime = commands[0].time1;
						video.playbackRate = commands[0].rate;
					}
				}
			}
		}, 250);
	return exec_interval;
}
