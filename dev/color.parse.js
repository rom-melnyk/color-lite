;(function (color) {
	/**
	 * @private
	 * @param {String} format			one of "rgb", "rgba", "hsl", "hsla"
	 * @return {String}					"xxxa" for the "xxx" and vice versa
	 */
	var getAlternativeFormat = function (format) {
		return (format.length === 3)
			? (format + 'a')
			: format.substr(0, format.length - 1);
	};

	/**
	 * @private
	 * @param {String} content			the string to parse like "#ab059f"
	 * @return {Array}					something like ['rgbhex', 14, 192, 200]
	 */
	var parseHexRgb = function (content) {
		var ret = ['rgbhex'],
			parsed = color.masks.rgbhex.exec(content),
			i;

		if (parsed) {
			parsed = parsed[1];

			// #abc --> #aabbcc
			if (parsed.length === 3) {
				parsed = parsed.split('');
				for (i = 0; i < 6; i += 2) {
					parsed.splice(i + 1, 0, parsed[i]);
				}
				parsed = parsed.join('');
			}

			for (i = 0; i < 6; i += 2) {
				ret.push(parseInt(parsed.substr(i, 2), 16));
			}
		}
		return ret;
	};

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
			var parsedString = color.masks[format].exec(content)
				|| color.masks[ getAlternativeFormat(format) ].exec(content);

			// be ready to handle the "#abcdef" format
			if (!parsedString && (format === 'rgb' || format === 'rgba')) {
				parsedString = parseHexRgb(content);
			}

			if (!parsedString) {
				parsedString = [];
			}
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
