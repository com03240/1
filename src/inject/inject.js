// check ready state
chrome.extension.sendMessage({}, function (response) {
	$(document).ready(function () {
		// this is the controller
		chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
			var video = document.getElementsByTagName("video")[0];
			if (message.action === "get_video_data") {
				sendResponse({
					duration : video.duration,
					currentTime : video.currentTime,
					paused : video.paused
				});
			} else if (message.action === "script-run") {
				// clear currently executing script threads
				exec_clear();
				// press play
				video.play();
				// execute the script
				exec_exscript(message.script, video);
				sendResponse(video.paused);
			} else if (message.action === "script-cancel") {
				// clear currently executing script thread
				exec_clear();
				// reset rate
				video.playbackRate = 1;
			} else if (message.action === "get_status") {
				sendResponse(exec_script);
			} else if (message.action === "ui-icon-pause") {
				video.pause();
				sendResponse(video.paused);
			} else if (message.action === "ui-icon-play") {
				video.play();
				sendResponse(video.paused);
			} else {
				sendResponse(message.action)
			}
		});
	})
});
