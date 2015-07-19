document.addEventListener("DOMContentLoaded", function(event) {
	// http://stackoverflow.com/a/3560038
	var imgURL = chrome.extension.getURL("icons/icon48.png");
	document.getElementById("logo").src = imgURL;

	var select = document.getElementById("ex_select");
	var script_name = document.getElementById("ex_label");
	var script_text = document.getElementById("ex_editor");

	var current_tab = null;

	function get_video_id(url) {
		var v = null;
		url.slice(url.indexOf("?") + 1).split("&").forEach(function(param) {
			var tokens = param.split("=");
			v = (tokens[0] == "v") ? tokens[1] : v;
		});
		return v;
	}

	// init
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		console.log("init >");
		current_tab = tabs[0];
		var key = get_video_id(current_tab.url);
		var query = {};
		query[key] = {};
		query[key]["scripts"] = {};
		console.log("query: " + JSON.stringify(query));
		chrome.storage.sync.get(query, function(obj) {
			for (var name in obj[key]["scripts"]) {
				add_option(name);
			}
			var data = get_popup_data();
			if (data.selected !== null) {
				script_name.value = data.selected;
				script_text.value = obj[key]["scripts"][data.selected];
			}
		});
	});

	function get_popup_data() {
		var idx = select.selectedIndex;
		return {
			"selected": (idx > -1) ? select.options[idx].value : null,
			"script_name": script_name.value,
			"script_text": script_text.value
		};
	}

	function add_option(text) {
		var option = document.createElement("option");
		option.text = text;
		select.add(option);
	}

	select.onchange = function(event) {
		console.log("onchange >");
		var key = get_video_id(current_tab.url);
		var query = {};
		query[key] = {};
		query[key]["scripts"] = {};
		console.log(query);
		chrome.storage.sync.get(query, function(obj) {
			console.log(obj);
			script_name.value = event.target.value;
			script_text.value = obj[key]["scripts"][event.target.value];
		});
	};

	document.getElementById("ex_stop").onclick = function(event) {
		var message = {
			action: "eval_clear"
		};
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, message, function(response) {});
		});
	};

	document.getElementById("ex_run").onclick = function(event) {
		var message = {
			action: "eval_exscript",
			script: script_text.value
		};
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, message, function(response) {});
		});
	};

	document.getElementById("ex_save").onclick = function(event) {
		console.log("save >");
		var key = get_video_id(current_tab.url);
		var query = {};
		query[key] = {};
		query[key]["scripts"] = {};
		console.log("query: " + JSON.stringify(query));
		chrome.storage.sync.get(query, function(obj) {
			var data = get_popup_data();
			obj[key]["scripts"][data.script_name] = data.script_text;
			chrome.storage.sync.set(obj, function() {
				if (data.script_name !== data.selected) {
					add_option(data.script_name);
					select.value = data.script_name;
				}
			});
		});
	};

	document.getElementById("ex_delete").onclick = function(event) {
		var key = get_video_id(current_tab.url);
		var query = {};
		query[key] = {};
		query[key]["scripts"] = {};
		chrome.storage.sync.get(query, function(obj) {
			var data = get_popup_data();
			delete obj[key]["scripts"][data.script_name];
			chrome.storage.sync.set(obj, function() {
				select.remove(select.selectedIndex);
				if (select.options.length > 0) {
					var event = {
						"target": { "value": select.options[0].value }
					};
					select.onchange(event);
				} else {
					script_name.value = "";
					script_text.value = "";
				}
			});
		});
	};
});


