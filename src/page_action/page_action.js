document.addEventListener("DOMContentLoaded", function(event) {
	var select = document.getElementById("ex_select");
	var script_name = document.getElementById("ex_label");
	var script_text = document.getElementById("ex_editor");

	var currentUrl = '';

	chrome.storage.local.get("scripts", function(obj) {
		chrome.tabs.getSelected(null,function(tab) {
			currentUrl = tab.url;
			for (var name in obj.scripts[currentUrl]) {
				add_option(name);
			}
			var idx = select.selectedIndex;
			if (idx > -1) {
				script_name.value = select.options[idx].value;
				script_text.value = obj.scripts[currentUrl][script_name.value];
			}
		});
	});

	function get_popup_data() {
		var idx = select.selectedIndex;
		return {
			"select": (select > -1) ? select.options[idx].value : null,
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
		chrome.storage.local.get({"scripts": {}}, function(obj) {
			script_name.value = event.target.value;
			script_text.value = obj.scripts[currentUrl][script_name.value];
		});
	};

	document.getElementById("ex_run").onclick = function(event) {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, script_text.value, function(response) {});
		});
	};

	document.getElementById("ex_save").onclick = function(event) {
		var data = get_popup_data();
		chrome.storage.local.get({"scripts": {}}, function(obj) {
			var item = obj.scripts[currentUrl];
			item[data.script_name] = data.script_text;
			obj.scripts[currentUrl] = item;

			chrome.storage.local.set(obj, function() {
				var idx = select.selectedIndex;
				if (idx === -1 || data.script_name !== select.options[idx].value) {
					add_option(data.script_name);
					select.value = data.script_name;
				}
			});
		});
	};

	document.getElementById("ex_clear").onclick = function(event) {
		script_text.value = "";
	};

	document.getElementById("ex_delete").onclick = function(event) {
		var data = get_popup_data();
		chrome.storage.local.get({"scripts": {}}, function(obj) {
			var config = obj.scripts[currentUrl];
			delete config[data.script_name];
			chrome.storage.local.set(obj, function() {
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


