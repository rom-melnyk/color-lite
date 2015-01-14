/**
 * The module scaffolding
 */
;(function () {
	var color;

	if (!window.$color) {
		color = window.$color = {};
	}

	// following will be provided in separate modules
	color.masks = {};
	color.hsl = function () {};
	color.hsla = function () {};

	color.rgb = function () {
		console.warn('[ i ] color.js: $color.rgb() is not released in this version.');
	};
	color.rgba = function () {
		console.warn('[ i ] color.js: $color.rgba() is not released in this version.');
	};


})();
