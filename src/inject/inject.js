chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
		}
	}, 10);
});

chrome.runtime.onMessage.addListener(function(message) {
	if (message.action === "eval_exscript") {
		var exscript = parse_exscript(message.script);
		var video = document.getElementsByTagName("video")[0];
		if (exscript.length > 0) {
			eval_clear();
			eval_exscript(exscript, video);
		}
	} else if (message.action === "eval_clear") {
		eval_clear();
	}
});


