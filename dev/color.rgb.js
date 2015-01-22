;(function (color) {
	/**
	 * @constructor
	 * @param {Number|String|Object} r			Red value or the "rgba(...)" string or the {r:..., g:..., b:..., a:...} object
	 * @param {Number} [g]						Green value
	 * @param {Number} [b]						Blue value
	 * */
	color.rgb = color.__Factory__('rgb');

	/**
	 * @override
	 * @return {String}				something like "rgba(154, 45, 250)"
	 */
	color.rgb.prototype.toString = function () {
		return 'rgb('
			+ this.r + ', '
			+ this.g + ', '
			+ this.b + ')';
	};


})(window.$color);
