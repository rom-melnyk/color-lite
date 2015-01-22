;(function (color) {
	/**
	 * @constructor
	 * @param {Number|String|Object} h			hue value or the "hsl(...)" string or the {h:..., s:..., l:..., a:...} object
	 * @param {Number} [s]						saturation value
	 * @param {Number} [l]						brightness/luminosity value
	 * */
	color.hsl = color.__Factory__('hsl');

	/**
	 * @override
	 * @return {String}				something like "hsl(154, 45%, 50%)"
	 */
	color.hsl.prototype.toString = function () {
		return 'hsl('
			+ this.h + ', '
			+ this.s + '%, '
			+ this.l + '%)';
	};


})(window.$color);
