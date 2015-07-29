$(document).ready(function(){
	console.log("ready!");
	/*
	$.widget( "ui.timespinner", $.ui.spinner, {
		options: {
			// seconds
			step: 60 * 1000,
			// hours
			page: 60
		},
		_parse: function( value ) {
			console.log(hhmmss_to_ss(value));
			return value;
		},
		_format: function( value ) {
			console.log(value);
			return value;
		}
	});
	*/
	
	console.log(hhmmss_to_ss("00:00:00"));
	console.log(hhmmss_to_ss("00:00:01"));
	console.log(hhmmss_to_ss("00:01:00"));
	console.log(hhmmss_to_ss("01:00:00"));
	
	// initialize popup data
	var video_data = null;
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id, { 
				action: "get_video_data"
			}, function(response) {
				video_data = response.video_data;
			}
		);
	});
	
	$("#addcmd").click(function(event) {
		// clone command template and make visible
		var cmd = $("#templatecmd").clone().css("display", true).attr("id", "x");
		// initialize time spinner
		console.log(cmd.children('input[class^="time"]'));
		cmd.children('input[class^="time"]').timespinner();
		// initialize slider
		cmd.children(".slider-range").slider({
			range: true,
			min: 0,
			max: 500,
			values: [ 75, 300 ],
			slide: function( event, ui ) {
				console.log(ui);
			}
		});
		cmd.insertBefore("#addcmd");
	});
})

/**
 * Convert the time token into seconds.
 * The token may specify seconds up to the number of hours.
 * 
 * @param {string} the time
 * @return {number} the number of seconds
 */
function hhmmss_to_ss(hhmmss) {
	var tokens = hhmmss.split(":");
	var index_to_multiplier = [60 * 60, 60, 1];
	sum = 0;
	if (tokens.length <= 3) {
		$.each(tokens, function(index, value) {
			sum += index_to_multiplier[index] * parseInt(value);
		});
	} else {
		sum = -1;
	}
	return sum;
}


