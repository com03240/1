$(document).ready(function(){
	console.log("ready!");
	
	// initialize popup data
	var video_data = 60 * 3;
	
	/*
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(
				tabs[0].id, { 
					action: "get_video_data"
				}, function(response) {
					video_data = response.video_data;
				}
			);
		});
	*/
	
	$("#addcmd").click(function(event) {
		// clone command template and make visible
		var id_suffix = $(".command").size();
		var cmd = $("#templatecmd").clone();
		cmd.addClass("command");
		cmd.css("display", true);
		cmd.attr("id", cmd.attr("class") + "_" + id_suffix);
		// initialize time spinner
		$.each(cmd.children(), function(index, value) {
			$(value).attr("id", $(value).attr("class") + "_" + id_suffix);
		});
		cmd.children(".time1").timespinner({
			min: ss_to_hhmmss(0),
			max: ss_to_hhmmss(video_data),
			change: on_change,
			spin: on_spin
		}).val(ss_to_hhmmss(video_data * 0.25));
		cmd.children(".time2").timespinner({
			min: ss_to_hhmmss(0),
			max: ss_to_hhmmss(video_data),
			change: on_change,
			spin: on_spin
		}).val(ss_to_hhmmss(video_data * 0.75));
		// initialize slider range
		cmd.children(".slider-range").slider({
			range: true,
			min: 0,
			max: video_data,
			values: [video_data * 0.25, video_data * 0.75],
			slide: on_slide
		});
		// initialize loop spinner
		cmd.children(".loop").loopspinner();
		// initialize rate spinner
		cmd.children(".rate").ratespinner();
		cmd.appendTo("#commands");
	});
})

function on_change(event, ui) {
	var tokens = event.target.id.split("_");
	
	var t0 = timespinner_parse(event.target.value);
	var t1 = $("#time1_" + tokens[1]).timespinner("value");
	var t2 = $("#time2_" + tokens[1]).timespinner("value");
	var tm = $("#slider-range_" + tokens[1]).slider("option", "max");
	
	if (tokens[0] == "time1") {
		if (0 <= t0 && t1 <= t2) {
			$("#slider-range_" + tokens[1]).slider("values", 0, t0);
			$("#time1_" + tokens[1]).timespinner("value", t0);
		} else {
			$("#time1_" + tokens[1]).timespinner(
				"value", 
				$("#slider-range_" + tokens[1]).slider("values", 0)
			);
		}
	}
	if (tokens[0] == "time2") {
		if (t1 <= t0 && t0 <= tm) {
			$("#slider-range_" + tokens[1]).slider("values", 1, t0);
			$("#time2_" + tokens[1]).timespinner("value", t0);
		} else {
			$("#time2_" + tokens[1]).timespinner(
				"value", 
				$("#slider-range_" + tokens[1]).slider("values", 1)
			);
		}
	}
}

function on_slide(event, ui) {
	var tokens = event.target.id.split("_");
	$("#time1_" + tokens[1]).timespinner("value", ui.values[0]);
	$("#time2_" + tokens[1]).timespinner("value", ui.values[1]);
}

// http://stackoverflow.com/a/21025562
// http://stackoverflow.com/a/13250459
function on_spin(event, ui) {
	var tokens = $(this).attr("id").split("_");
	var t0 = ui.value;
	var t1 = $("#time1_" + tokens[1]).timespinner("value");
	var t2 = $("#time2_" + tokens[1]).timespinner("value");
	var value = -1;
	var handle = -1;
	if (tokens[0] == "time1") {
		if (t0 <= t2) {
			value = t0;
			handle = 0;
		} else {
			event.preventDefault();
		}
	}
	if (tokens[0] == "time2") {
		if (t1 <= t0) {
			value = t0;
			handle = 1;
		} else {
			event.preventDefault();
		}
	}
	if (value > -1) {
		$("#slider-range_" + tokens[1]).slider("values", handle, value);
	}
}


