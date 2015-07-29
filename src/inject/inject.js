// check ready state
chrome.extension.sendMessage({}, function(response) {
	$(document).ready(function(){
		console.log("ready!");
	})
});

// this is the controller
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	var video = document.getElementsByTagName("video")[0];
	if (message.action == "get_video_data") {
		// inform the page action of success
		sendResponse({ video_data: video.duration });
	}
});


