// check ready state
chrome.extension.sendMessage({}, function (response) {
	$(document).ready(function () {
		// this is the controller
		chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
			var video = document.getElementsByTagName("video")[0];
			if (message.action === "get_video_data") {
				// inform the page action of success
				sendResponse({
					duration : video.duration,
					currentTime : video.currentTime
				});
			} else if (message.action === "script-run") {
				// clear currently executing script threads
				exec_clear();
				// press play
				video.play();
				// execute the script
				exec_exscript(message.script, video);
			} else if (message.action === "script-cancel") {
				// clear currently executing script thread
				exec_clear();
				// reset rate
				video.playbackRate = 1;
			} else if (message.action === "get_status") {
				sendResponse(exec_script);
			}
		});
	})
});
