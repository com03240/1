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
	
	$("#commands").sortable();
	$("#commands").disableSelection();
	
	$("#command-add").button().click(function(event) {
		// clone command template and make visible
		var id_suffix = $(".command").size();
		var cmd = $("#command-template").clone();
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
		// initialize reps spinner
		cmd.children(".reps").loopspinner();
		// initialize rate spinner
		cmd.children(".rate").ratespinner();
		cmd.appendTo("#commands");
	});
})

function on_change(event, ui) {
	var tokens = event.target.id.split("_");
	var t1 = $("#time1_" + tokens[1]).timespinner("value");
	var t2 = $("#time2_" + tokens[1]).timespinner("value");
	var tm = $("#slider-range_" + tokens[1]).slider("option", "max");
	
	var h = tokens[0] == "time1" ? 0 : 1;
	var v = timespinner_parse(event.target.value);
	if (!(h == 0 && 0 <= v && v <= t2 || h == 1 && t1 <= v && v <= tm)) {
		v = $("#slider-range_" + tokens[1]).slider("values", h);
	}
	$("#slider-range_" + tokens[1]).slider("values", h, v);
	$("#" + event.target.id).timespinner("value", v);
}

// http://stackoverflow.com/a/21025562
// http://stackoverflow.com/a/13250459
function on_spin(event, ui) {
	var tokens = $(this).attr("id").split("_");
	var t1 = $("#time1_" + tokens[1]).timespinner("value");
	var t2 = $("#time2_" + tokens[1]).timespinner("value");
	
	var h = tokens[0] == "time1" ? 0 : 1;
	var v = ui.value;
	if (h == 0 && v <= t2 || h == 1 && t1 <= v) {
		$("#slider-range_" + tokens[1]).slider("values", h, v);
	} else {
		event.preventDefault();
	}
}

function on_slide(event, ui) {
	var tokens = event.target.id.split("_");
	$("#time1_" + tokens[1]).timespinner("value", ui.values[0]);
	$("#time2_" + tokens[1]).timespinner("value", ui.values[1]);
}


