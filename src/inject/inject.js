chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
		}
	}, 10);
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
		var video = document.getElementsByTagName("video")[0];
	if (message.action === "eval_exscript") {
		var exscript = parse_exscript(message.script);
		if (exscript.length > 0) {
			eval_clear();
			video.play();
			eval_exscript(exscript, video);
		}
	} else if (message.action === "eval_clear") {
		eval_clear();
	} else if (message.action === "is_paused") {
		sendResponse({ is_paused: video.paused });
	} else if (message.action == "toggle_play") {
		video.play();
	} else if (message.action == "toggle_pause") {
		video.pause();
	}
});


