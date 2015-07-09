document.addEventListener("DOMContentLoaded", function(event) {
	console.log("ready!");
	
	var sel = document.getElementById("ex_select");
	var lab = document.getElementById("ex_label");
	var vim = document.getElementById("ex_editor");
	
	chrome.storage.local.get("scripts", function(obj) {
		for (var key in obj.scripts) {
			add_option(key);
		}
		var idx = sel.selectedIndex;
		if (idx > -1) {
			lab.value = sel.options[idx].value;
			vim.value = obj.scripts[lab.value];
		}
	});
	
	function get_popup_data() {
		var idx = sel.selectedIndex;
		return {
			"sel": (sel > -1) ? sel.options[idx].value : null,
			"lab": lab.value,
			"vim": vim.value
		};
	}
	
	function add_option(text) {
		var option = document.createElement("option");
		option.text = text;
		sel.add(option);
	}
	
	sel.onchange = function(event) {
		chrome.storage.local.get({"scripts": {}}, function(obj) {
			lab.value = event.target.value;
			vim.value = obj.scripts[lab.value];
		});
	}
	
	document.getElementById("ex_run").onclick = function(event) {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, vim.value, function(response) {});
		});
	}
	
	document.getElementById("ex_save").onclick = function(event) {
		var data = get_popup_data();
		chrome.storage.local.get({"scripts": {}}, function(obj) {
			obj.scripts[data.lab] = data.vim;
			chrome.storage.local.set(obj, function() {
				var idx = sel.selectedIndex;
				if (idx === -1 || data.lab !== sel.options[idx].value) {
					add_option(data.lab);
					sel.value = data.lab;
				}
			});
		});
	}
	
	document.getElementById("ex_clear").onclick = function(event) {
		vim.value = "";
	}
	
	document.getElementById("ex_delete").onclick = function(event) {
		var data = get_popup_data();
		chrome.storage.local.get({"scripts": {}}, function(obj) {
			delete obj.scripts[data.lab];
			chrome.storage.local.set(obj, function() {
				sel.remove(sel.selectedIndex);
				if (sel.options.length > 0) {
					var event = {
						"target": { "value": sel.options[0].value }
					}
					sel.onchange(event);
				} else {
					lab.value = "";
					vim.value = "";
				}
			});
		});
	}
});


