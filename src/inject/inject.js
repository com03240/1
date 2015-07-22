// check ready state
chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
		}
	}, 10);
});

// this is the controller
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	var video = document.getElementsByTagName("video")[0];
	if (message.action === "exec_exscript") {
		// parse and execute the script
		var exscript = parse_exscript(message.script);
		if (exscript.length > 0) {
			// clear currently executing script threads
			exec_clear();
			// press play
			video.play();
			// execute the script
			exec_exscript(exscript, video);
		}
	} else if (message.action === "exec_clear") {
		// clear currently executing script thread
		exec_clear();
	} else if (message.action === "is_paused") {
		// check for paused
		sendResponse({ is_paused: video.paused });
	} else if (message.action == "toggle_play") {
		// press play
		video.play();
		// inform the page action of success
		sendResponse({ is_paused: video.paused });
	} else if (message.action == "toggle_pause") {
		// press pause
		video.pause();
		// inform the page action of success
		sendResponse({ is_paused: video.paused });
	}
});


