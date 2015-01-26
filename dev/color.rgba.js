;(function (color) {
	/**
	 * @constructor
	 * @param {Number|String|Object} r			Red value or the "rgba(...)" string or the {r:..., g:..., b:..., a:...} object
	 * @param {Number} [g]						Green value
	 * @param {Number} [b]						Blue value
	 * @param {Number} [a]						Alpha value
	 * */
	color.rgba = color.__Factory__('rgba');

	/**
	 * @override
	 * @return {String}				something like "rgba(154, 45, 250, .9)"
	 */
	color.rgba.prototype.toString = function () {
		return 'rgba('
			+ this.r + ', '
			+ this.g + ', '
			+ this.b + ', '
			+ this.a + ')';
	};

	/**
	 * @return {Object}				same color but in HSLA
	 */
	color.rgba.prototype.toHsla = function () {
		var hsla = color.convert.rgb2hsl(this);
		hsla.a = this.a;
		return new color.hsla(hsla);
	};


})(window.$color);
