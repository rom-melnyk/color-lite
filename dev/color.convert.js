;(function (color) {
	color.convert = {};

	/**
	 * @param {Object} rgb				the color representation: `{r:..., g:..., b:...}`
	 * @return {Object} 				same but `{h:..., s:..., l:...}`
	 */
	color.convert.rgb2hsl = function (rgb) {
		var r = color.normalizeChannel('r', rgb.r) / 255,
			g = color.normalizeChannel('g', rgb.g) / 255,
			b = color.normalizeChannel('b', rgb.b) / 255,
			max = Math.max(r, g, b),
			min = Math.min(r, g, b),
			delta = max - min,
			hsl = {};

		if (delta === 0) {
			hsl.h = 0;
		} else {
			if (r === max) {
				hsl.h = (g - b) / delta % 6;
			} else if (g === max) {
				hsl.h = (b - r) / delta + 2;
			} else /* if (b === max) */{
				hsl.h = (r - g) / delta + 4
			}
		}
		hsl.h = Math.round(hsl.h * 60);

		hsl.l = (max + min) / 2;

		hsl.s = (hsl.l === 0 || hsl.l === 1)
			? 0
			: (delta / (1 - Math.abs(2 * hsl.l - 1)));

		hsl.s = Math.round(100 * hsl.s);
		hsl.l = Math.round(100 * hsl.l);
		return hsl;
	};

	/**
	 * @param {Object} hsl				the color representation: `{h:..., s:..., l:...}`
	 * @return {Object} 				same but `{r:..., g:..., b:...}`
	 */
	color.convert.hsl2rgb = function (hsl) {
		var h = color.normalizeChannel('h', hsl.h),
			s = color.normalizeChannel('s', hsl.s) / 100,
			l = color.normalizeChannel('l', hsl.l) / 100,
			C = (1 - Math.abs(2 * l - 1)) * s,
			X = C * (1 - Math.abs(h / 60 % 2 - 1)),
			M = l - C/ 2,
			rgb = {};

		if ((h >= 0) && (h < 60)) {
			rgb = {r: C, g: X, b: 0};
		} else if ((h >= 60) && (h < 120)) {
			rgb = {r: X, g: C, b: 0};
		} else if ((h >= 120) && (h < 180)) {
			rgb = {r: 0, g: C, b: X};
		} else if ((h >= 180) && (h < 240)) {
			rgb = {r: 0, g: X, b: C};
		} else if ((h >= 240) && (h < 300)) {
			rgb = {r: X, g: 0, b: C};
		} else /*if ((h >= 300) && (h < 360))*/ {
			rgb = {r: C, g: 0, b: X};
		}

		['r', 'g', 'b'].forEach(function (ch) {
			rgb[ch] = Math.round((rgb[ch] + M) * 255);
		});

		return rgb;
	}
})(window.$color);
