;(function (color) {
	/**
	 * @constructor
	 * @param {Number|String|Object} h			hue value or the "hsla(...)" string or the {h:..., s:..., l:..., a:...} object
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
			+ (this.a === 0 || this.a === 1 ? this.a : this.a.toFixed(2)) + ')';
	};

	/**
	 * @return {Object}				same but in RGBA
	 */
	color.hsla.prototype.toRgba = function () {
		var rgba = color.convert.hsl2rgb(this);
		rgba.a = this.a;
		return new color.rgba(rgba);
	};

})(window.$color);
