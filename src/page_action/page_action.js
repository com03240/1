$(document).ready(function(){
	console.log("ready!");
	
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id, { 
				action: "get_video_data"
			}, function(response) {
				video_data = response;
			}
		);
	});
	
	// TODO: get previous script
	
	// status check
	setInterval(function() {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(
				tabs[0].id, { 
					action: "get_status"
				}, function(response) {
					if (response !== null && response.length > 0) {
						$("#" + response[0].id).effect("highlight", {}, 2500);
					} else {
						$(".command").stop(true, true);
					}
				}
			);
		});
	}, 250);
	
	$("#commands").sortable();
	$("#commands").disableSelection();
	
	$("#script-run").button({ disabled: true }).click(function(event) {
		var script  = $.map($(".command:has(:checked)"), function(e, i) {
			var tokens = e.id.split("_");
			return {
				id: e.id,
				time1: $("#time1_" + tokens[1]).timespinner("value"),
				time2: $("#time2_" + tokens[1]).timespinner("value"),
				loops: $("#reps_" + tokens[1]).loopspinner("value"),
				speed: $("#rate_" + tokens[1]).ratespinner("value") / 100
			};
		});
		var message = { action: $(this).attr("id"), script: script };
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, message, function(response) {});
		});
	});
	$("#script-cancel").button({ disabled: true }).click(function(event){
		var message = { action: $(this).attr("id") };
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, message, function(response) {});
		});
	});
	$("#command-add").button().click(on_click);
	$("#command-remove").button({ disabled: true }).click(function(event){
		$(".command:has(:checked)").remove();
		toggle_buttons();
	});
	$("#command-invert").button({ disabled: true }).click(function(event){
		$.each($(":checkbox"), function(i, e) {
			$(e).prop("checked", !($(e).prop("checked")));
		});
	});
})

function toggle_buttons() {
	var state = $(".command:has(:checked)").length > 0 ? "enable" : "disable";
	console.log(state);
	$("#script-run, #script-cancel, #command-remove, #command-invert").button(state);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// globals
////////////////////////////////////////////////////////////////////////////////////////////////////

var video_data = null;

////////////////////////////////////////////////////////////////////////////////////////////////////
// events
////////////////////////////////////////////////////////////////////////////////////////////////////

function on_change(event, ui) {
	var tokens = event.target.id.split("_");
	var t1 = $("#time1_" + tokens[1]).timespinner("value");
	var t2 = $("#time2_" + tokens[1]).timespinner("value");
	var tm = $("#slider-range_" + tokens[1]).slider("option", "max");
	
	var h = tokens[0] === "time1" ? 0 : 1;
	var v = timespinner_parse(event.target.value);
	if (!(h === 0 && 0 <= v && v <= t2 || h === 1 && t1 <= v && v <= tm)) {
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
	
	var h = tokens[0] === "time1" ? 0 : 1;
	var v = ui.value;
	if (h === 0 && v <= t2 || h === 1 && t1 <= v) {
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

function on_click(event) {
	// clone command template and make visible
	var id_suffix = 0;
	$.each($(".command"), function(i, e) { 
		id_suffix = Math.max(+(e.id.split("_")[1]), id_suffix);
	});
	id_suffix++;
	var cmd = $("#command-template").clone();
	cmd.addClass("command");
	cmd.css("display", true);
	cmd.attr("id", cmd.attr("class") + "_" + id_suffix);
	// initialize time spinner
	$.each(cmd.children(), function(index, value) {
		$(value).attr("id", $(value).attr("class") + "_" + id_suffix);
	});
	console.log(video_data);
	cmd.children(".time1").timespinner({
		min: ss_to_hhmmss(0),
		max: ss_to_hhmmss(video_data.duration),
		change: on_change,
		spin: on_spin
	}).val(ss_to_hhmmss(video_data.duration * 0.25));
	cmd.children(".time2").timespinner({
		min: ss_to_hhmmss(0),
		max: ss_to_hhmmss(video_data.duration),
		change: on_change,
		spin: on_spin
	}).val(ss_to_hhmmss(video_data.duration * 0.75));
	// initialize slider range
	cmd.children(".slider-range").slider({
		range: true,
		min: 0,
		max: video_data.duration,
		values: [video_data.duration * 0.25, video_data.duration * 0.75],
		slide: on_slide
	});
	// initialize reps spinner
	cmd.children(".reps").loopspinner();
	// initialize rate spinner
	cmd.children(".rate").ratespinner();
	cmd.appendTo("#commands");
	// register on check
	cmd.children(":checkbox").change(toggle_buttons);
	// toggle buttons
	toggle_buttons();
}


