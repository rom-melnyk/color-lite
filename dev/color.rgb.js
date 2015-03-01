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
	 * @param [hex=false]			if set to "hex", makes the output like "#ba5e7f"
	 * @return {String}				something like "rgba(154, 45, 250)" or "#ba5e7f"
	 */
	color.rgb.prototype.toString = function (hex) {
		return (hex === 'hex')
			? '#'
				+ ('0' + this.r.toString(16)).substr(-2, 2)
				+ ('0' + this.g.toString(16)).substr(-2, 2)
				+ ('0' + this.b.toString(16)).substr(-2, 2)
			: 'rgb('
				+ this.r + ', '
				+ this.g + ', '
				+ this.b + ')';
	};

	/**
	 * @return {Object}				same color but in HSL
	 */
	color.rgb.prototype.toHsl = function () {
		return new color.hsl(
			color.convert.rgb2hsl(this)
		);
	};

})(window.$color);
