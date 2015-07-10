chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			// ----------------------------------------------------------
			// This part of the script triggers when page is done loading
			console.log("Hello. This message was sent from scripts/inject.js");
			// ----------------------------------------------------------

		}
	}, 10);
});

chrome.runtime.onMessage.addListener(function(message) {
	var exscript = parse_exscript(message);
	var video = document.getElementsByTagName("video")[0];
	eval_exscript(exscript, video);
});


