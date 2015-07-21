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
		var exscript = parse_exscript(message.script);
		if (exscript.length > 0) {
			exec_clear();
			video.play();
			exec_exscript(exscript, video);
		}
	} else if (message.action === "exec_clear") {
		exec_clear();
	} else if (message.action === "is_paused") {
		sendResponse({ is_paused: video.paused });
	} else if (message.action == "toggle_play") {
		video.play();
		sendResponse({ is_paused: video.paused });
	} else if (message.action == "toggle_pause") {
		video.pause();
		sendResponse({ is_paused: video.paused });
	}
});


