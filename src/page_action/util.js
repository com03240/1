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
 * Convert the time token into seconds.
 * The token may specify seconds up to the number of hours.
 * 
 * @param {string} the time
 * @return {number} the number of seconds
 */
function hhmmss_to_ss(hhmmss) {
	// split
	var tokens = hhmmss.split(":").map(function(e) {
		// convert empty strings to 0
		return e === "" ? 0 : e;
	});
	var ss = 0;
	if (tokens.length <= 3) {
		var index_to_multiplier = [60 * 60, 60, 1].slice(3 - tokens.length);
		$.each(tokens, function(index, value) {
			ss += index_to_multiplier[index] * parseInt(value);
		});
	} else {
		ss = -1;
	}
	return ss;
}

/**
 * Convert seconds into a time string.
 * 
 * @return {number} the number of seconds
 * @param {string} the time
 */
function ss_to_hhmmss(ss) {
	var hh = 0;
	if (ss >= 3600) {
		hh = Math.floor(ss / 3600);
		ss -= hh * 3600;
	}
	var mm = 0;
	if (ss >= 60) {
		mm = Math.floor(ss / 60);
		ss -= mm * 60
	}
	var hh_pad = (hh < 10) ? "0" : "";
	var mm_pad = (mm < 10) ? "0" : "";
	var ss_pad = (ss < 10) ? "0" : "";
	return hh_pad + hh + ":" + mm_pad + mm + ":" + ss_pad + ss;
}

function timespinner_parse(value) {
	// console.log("parse > " + value);
	if (typeof value === "string") {
		// already a timestamp
		if (Number(value) == value) {
			return Number(value);
		}
		return hhmmss_to_ss(value);
	}
	return value;
}

$.widget("ui.timespinner", $.ui.spinner, {
	options: {
		// seconds
		step: 1,
		// minutes
		page: 60
	},
	_parse: timespinner_parse,
	_format: function(value) {
		return ss_to_hhmmss(value);
	}
});

// http://stackoverflow.com/a/17708266
$.widget("ui.loopspinner", $.ui.spinner, {
	_format: function(value) {
		return value + "x";
	},
	_parse: function(value) {
		return parseInt(value);
	}
});

$.widget("ui.ratespinner", $.ui.spinner, {
	options: {
		// seconds
		step: 1,
		// minutes
		page: 10
	},
	_format: function(value) {
		return value + "%";
	},
	_parse: function(value) {
		return parseFloat(value);
	}
});

// test
console.log(hhmmss_to_ss(":00"));
console.log(hhmmss_to_ss(":01"));
console.log(hhmmss_to_ss("00:00"));
console.log(hhmmss_to_ss("00:01"));
console.log(hhmmss_to_ss("01:00"));
console.log(hhmmss_to_ss("00:00:00"));
console.log(hhmmss_to_ss("00:00:01"));
console.log(hhmmss_to_ss("00:01:00"));
console.log(hhmmss_to_ss("01:00:00"));
console.log(ss_to_hhmmss(0));
console.log(ss_to_hhmmss(60));
console.log(ss_to_hhmmss(3600));
console.log(ss_to_hhmmss(3660));
console.log(ss_to_hhmmss(3661));


