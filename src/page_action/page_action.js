document.addEventListener("DOMContentLoaded", function(event) {
	console.log("ready!");
	document.getElementById("ex_run").onclick = function(event) {
		var ex_script = document.getElementById("ex_editor").value;
		parse_script(ex_script);
	}
});


