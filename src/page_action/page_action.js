document.addEventListener("DOMContentLoaded", function(event) {
	console.log("ready!");
	
	chrome.storage.local.get(null, function(obj) {
		console.log(obj);
		var ex_select = document.getElementById("ex_select");
		for (var key in obj) {
			var option = document.createElement("option");
			option.text = key;
			ex_select.add(option);
		}
		if (ex_select.options.length > 0) {
			var ex_label = document.getElementById("ex_label");
			var ex_script = document.getElementById("ex_editor");
			ex_label.value = ex_select.options[ex_select.selectedIndex].value;
			console.log(obj);
			ex_script.value = obj[ex_label.value];
		}
	});
	
	document.getElementById("ex_select").onchange = function(event) {
		document.getElementById("ex_label").value = event.target.value;
		chrome.storage.local.get(null, function(obj) {
			document.getElementById("ex_editor").value = obj[event.target.value];
		});
	};
	
	document.getElementById("ex_run").onclick = function(event) {
		var ex_script_str = document.getElementById("ex_editor").value;
		var commands = parse_script(ex_script_str);
		console.log(commands);
	}
	
	document.getElementById("ex_save").onclick = function(event) {
		chrome.storage.local.get(null, function(obj) {
			var key = document.getElementById("ex_label").value;
			var val = document.getElementById("ex_editor").value;
			obj[key] = val;
			chrome.storage.local.set(obj, function() {
				console.log("save: " + key);
				var option = document.createElement("option");
				option.text = key;
				var ex_select = document.getElementById("ex_select");
				var selected = ex_select.options[ex_select.selectedIndex].value;
				ex_select.add(option)
				ex_select.value = key;
			});
		});
	}
	
	document.getElementById("ex_clear").onclick = function(event) {
		document.getElementById("ex_editor").value = "";
	}
	
	document.getElementById("ex_delete").onclick = function(event) {
		chrome.storage.local.get(null, function(obj) {
			var key = document.getElementById("ex_label").value;
			delete obj[key];
			chrome.storage.local.set(obj, function() {
				console.log("delete: " + key);
			});
		});
	}
});


