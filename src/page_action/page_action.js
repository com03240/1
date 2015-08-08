$(document).ready(function(){
	console.log("ready!");
	
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { action: "get_video_data" }, function(response) {
			current_tab = tabs[0];
			video_data = response;
			init_commands();
		})
	});
	
	// status check
	setInterval(function() {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, { action: "get_status" }, do_status);
		});
	}, 250);
	
	$("#script-run").button({ disabled: true }).click(function(event) {
		do_save();
		var script = commands_to_script(1);
		$.each(script, function(i, e) { 
			e.rate /= 100;
		});
		var message = { action: $(this).attr("id"), script: script };
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, message, function(response) {});
		});
	});
	$("#script-save").button().click(do_save);
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
	
	$("#commands").sortable();
	$("#commands").disableSelection();
});

var current_tab = null;
var video_data = null;

function init_command(command) {
	console.log(command);
	// clone command template and make visible
	var cmd = $("#command-template").clone();
	cmd.addClass("command");
	cmd.css("display", true);
	cmd.attr("id", "command_" + command.id_suffix);
	// initialize time spinner
	$.each(cmd.children(), function(i, e) {
		$(e).attr("id", $(e).attr("class") + "_" + command.id_suffix);
	});
	cmd.children(".time1").timespinner({
		min: ss_to_hhmmss(0),
		max: ss_to_hhmmss(video_data.duration),
		change: on_change,
		spin: on_spin
	}).val(ss_to_hhmmss(command.time1));
	cmd.children(".time2").timespinner({
		min: ss_to_hhmmss(0),
		max: ss_to_hhmmss(video_data.duration),
		change: on_change,
		spin: on_spin
	}).val(ss_to_hhmmss(command.time2));
	// initialize slider range
	cmd.children(".slider-range").slider({
		range: true,
		min: 0,
		max: video_data.duration,
		values: [command.time1, command.time2],
		slide: on_slide
	});
	// initialize reps spinner
	cmd.children(".reps").loopspinner().val(command.reps + "x");
	// initialize rate spinner
	cmd.children(".rate").ratespinner().val(command.rate + "%");
	// register on check
	cmd.children(":checkbox").prop("checked", command.check).change(toggle_buttons);
	return cmd;
}

function init_commands() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var key = get_video_id(tabs[0].url);
		var query = {};
		query[key] = {};
		chrome.storage.sync.get(query, function(obj) {
			$.each(obj[key], function(i, e) {
				init_command(e).appendTo("#commands");
			});
			toggle_buttons();
		});
	});
}

function commands_to_script(check) {
	var selector = ".command";
	if (check === 1) {
		selector += ":has(:checked)";
	}
	return $.map($(selector), function(e, i) {
		var tokens = e.id.split("_");
		return {
			id: e.id,
			id_suffix: tokens[1],
			time1: $("#time1_" + tokens[1]).timespinner("value"),
			time2: $("#time2_" + tokens[1]).timespinner("value"),
			reps: $("#reps_" + tokens[1]).loopspinner("value"),
			rate: $("#rate_" + tokens[1]).ratespinner("value"),
			check: $("#check_" + tokens[1]).prop("checked")
		};
	});
}

function do_save(event) {
	// query storage to get and alter the object
	console.log("save >");
	var key = get_video_id(current_tab.url);
	var query = {};
	query[key] = {};
	// get
	chrome.storage.sync.get(query, function(obj) {
		obj[key] = commands_to_script(0);
		chrome.storage.sync.set(obj, function() {
			$("#status").text("saved!");
		});
	});
}

function do_status(script) {
	if (script.length > 0) {
		var status = "running: ";
		status += ss_to_hhmmss(script[0].time1) + "-" + ss_to_hhmmss(script[0].time2) + " ";
		status += script[0].reps + "x @ " + (script[0].rate * 100) + "%";
		$("#status").text(status);
		// http://stackoverflow.com/a/4871668
		if ($(":animated").attr("id") !== script[0].id) {
			$(":animated").stop(true, true);
			$("#" + script[0].id).effect("highlight", {}, 2500);
		}
		// http://stackoverflow.com/a/10687623
		$("#cover").width($("#commands").get(0).scrollWidth);
		$("#cover").height($("#commands").height());
		$("#cover").css("display", "block");
		$("#script-cancel").button("enable");
		$("#script-run, #script-save").button("disable");
		$("#command-add, #command-remove, #command-invert").button("disable");
	} else {
		toggle_buttons();
	}
}

function toggle_buttons() {
	if ($(".command:has(:checked)").length > 0) {
		$("#status").text("stopped...");
		$("#cover").css("display", "none");
		$("#script-cancel").button("disable");
		$("#script-run, #script-save").button("enable");
		$("#script-run, #command-add, #command-remove, #command-invert").button("enable");
	} else if ($(".command").length > 0) {
		$("#script-save").button("enable");
		$("#script-run, #command-remove").button("disable");
	} else {
		$("#script-save").button("enable");
		$("#script-run, #command-remove, #command-invert").button("disable");
	}
}

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
	var time2 = video_data.currentTime + (video_data.duration * 0.05);
	time2 = time2 < video_data.duration ? time2 : video_data.duration;
	var cmd = init_command({
		id_suffix: id_suffix,
		time1: video_data.currentTime,
		time2: time2,
		reps: 1,
		rate: 100,
		check: true
	});
	cmd.appendTo("#commands");
	// toggle buttons
	toggle_buttons();
}

