;(function (color) {
	/**
	 * @constructor
	 * @param {Number|String|Object} h			hue value or the "hsl(...)" string or the {h:..., s:..., l:..., a:...} object
	 * @param {Number} [s]						saturation value
	 * @param {Number} [l]						brightness/luminosity value
	 * @param {Number} [a]						alpha value
	 * */
	color.hsla = color.__Factory__('hsla');

	/**
	 * @override
	 * @return {String}				something like "hsla(154, 45%, 50%, .9)"
	 */
	color.hsla.prototype.toString = function () {
		return 'hsla('
			+ this.h + ', '
			+ this.s + '%, '
			+ this.l + '%, '
			+ this.a + ')';
	};


})(window.$color);
