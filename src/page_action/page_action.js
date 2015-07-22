document.addEventListener("DOMContentLoaded", function(event) {
	// http://stackoverflow.com/a/3560038
	var imgURL = chrome.extension.getURL("icons/icon128.png");
	document.getElementById("logo").src = imgURL;
	
	// UI handles
	var select = document.getElementById("ex_select");
	var script_name = document.getElementById("ex_label");
	var script_text = document.getElementById("ex_editor");
	
	// current tab object
	var current_tab = null;
	
	// unicode symbols
	var play_symbol = "\u25B6";
	var pause_symbol = "\u25AE\u25AE";
	
	// initialize the video toggle button
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id, { 
				action: "is_paused"
			}, function(response) {
				console.log(response);
				var innerHTML = (response.is_paused) ? play_symbol : pause_symbol;
				document.getElementById("ex_play").innerHTML = innerHTML;
			}
		);
	});
	
	/**
	 * Get the URL for this video to store corresponding scripts by ID.
	 *
	 * @param url {string} the URL
	 * @return {string} the v parameter
	 */
	function get_video_id(url) {
		var v = null;
		url.slice(url.indexOf("?") + 1).split("&").forEach(function(param) {
			var tokens = param.split("=");
			v = (tokens[0] == "v") ? tokens[1] : v;
		});
		return v;
	}
	
	/**
	 * Get popup data from UI controls.
	 *
	 * @return {object} the popup data object
	 */
	function get_popup_data() {
		var idx = select.selectedIndex;
		return {
			"selected": (idx > -1) ? select.options[idx].value : null,
			"script_name": script_name.value,
			"script_text": script_text.value
		};
	}
	
	/**
	 * Add an option to the select UI.
	 *
	 * @param {string} the option text
	 */
	function add_option(text) {
		var option = document.createElement("option");
		option.text = text;
		select.add(option);
	}
	
	// initialize the popup
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		// query chrome storage for the script storage object
		console.log("init >");
		current_tab = tabs[0];
		var key = get_video_id(current_tab.url);
		var query = {};
		query[key] = {};
		query[key]["scripts"] = {};
		console.log("query: " + JSON.stringify(query));
		// initialize the UI controls based on the scripts obtained from storage
		chrome.storage.sync.get(query, function(obj) {
			// select UI
			for (var name in obj[key]["scripts"]) {
				add_option(name);
			}
			// input and editor UI
			var data = get_popup_data();
			if (data.selected !== null) {
				script_name.value = data.selected;
				script_text.value = obj[key]["scripts"][data.selected];
			}
		});
	});
	
	// initialize editor on selection of a script from the select UI
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
	
	// stop execution of the current script
	document.getElementById("ex_stop").onclick = function(event) {
		var message = {
			action: "exec_clear"
		};
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, message, function(response) {});
		});
	};
	
	
	// run the current script
	document.getElementById("ex_run").onclick = function(event) {
		var message = {
			action: "exec_exscript",
			script: script_text.value
		};
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, message, function(response) {});
		});
	};
	
	// save the current script
	document.getElementById("ex_save").onclick = function(event) {
		// query storage to get and alter the object
		console.log("save >");
		var key = get_video_id(current_tab.url);
		var query = {};
		query[key] = {};
		query[key]["scripts"] = {};
		console.log("query: " + JSON.stringify(query));
		// get
		chrome.storage.sync.get(query, function(obj) {
			var data = get_popup_data();
			// alter
			obj[key]["scripts"][data.script_name] = data.script_text;
			chrome.storage.sync.set(obj, function() {
				// update UI
				if (data.script_name !== data.selected) {
					add_option(data.script_name);
					select.value = data.script_name;
				}
			});
		});
	};
	
	// delete the current script from storage
	document.getElementById("ex_delete").onclick = function(event) {
		// query object
		var key = get_video_id(current_tab.url);
		var query = {};
		query[key] = {};
		query[key]["scripts"] = {};
		chrome.storage.sync.get(query, function(obj) {
			var data = get_popup_data();
			// alter
			delete obj[key]["scripts"][data.script_name];
			chrome.storage.sync.set(obj, function() {
				// update UI
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
	
	// send message to play/pause the video
	document.getElementById("ex_play").onclick = function(event) {
		var message = {};
		if (event.target.innerHTML === play_symbol) {
			event.target.innerHTML = pause_symbol;
			message["action"] = "toggle_play";
		} else {
			event.target.innerHTML = play_symbol;
			message["action"] = "toggle_pause";
		}
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
				var innerHTML = (response.is_paused) ? play_symbol : pause_symbol;
				event.target.innerHTML = innerHTML;
			});
		});
	};
});


