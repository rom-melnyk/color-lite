;(function (color) {
	/**
	 * Parses the given content against the given format.
	 * @param {String} format					one of "rgb", "rgba", "hsl", "hsla"
	 * @param {String|Object} content			the data to parse.
	 * 											The data might be passed as separate arguments.
	 * @return {Object}							something like {r: 90, g: 240, b: 130} respecting the
	 */
	color.parse = function (format, content) {
		if (['rgb', 'rgba', 'hsl', 'hsla'].indexOf(format) === -1) {
			format = 'rgb';
		}

		var ret = {},
			keys = format.split(''),
			i = 0;

		if (typeof content === 'object') {
			keys.forEach(function (key) {
				ret[key] = color.normalizeChannel( key, content[key] );
			});
		} else if (typeof content === 'string') {
			var parsedString,
				// returns "rgba" for the "rgb" and vice versa
				alternativeFormat = (function () {
					return (format.length === 3)
						? (format + 'a')
						: format.substr(0, format.length - 1);
				})();

			parsedString = color.masks[format].exec(content) || color.masks[alternativeFormat].exec(content) || [];
			i = 1; // need to check the parsed values starting from the second one

			keys.forEach(function (key) {
				ret[key] = color.normalizeChannel( key, parsedString[i++] );
			});
		} else {
			var args = [].slice.call(arguments, 1);
			keys.forEach(function (key) {
				ret[key] = color.normalizeChannel( key, args[i++] );
			});
		}

		return ret;
	};
})(window.$color);
