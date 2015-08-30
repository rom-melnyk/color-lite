var Factory = require('./color.factory');
var Convert = require('./color.convert');
var Color = require('./color');

/**
 * @constructor
 * @param {Number|String|Object} r			Red value or the "rgba(...)" string or the {r:..., g:..., b:..., a:...} object
 * @param {Number} [g]						Green value
 * @param {Number} [b]						Blue value
 * @param {Number} [a]						Alpha value
 * */
var Rgba = Factory('rgba');

/**
 * @override
 * @return {String}				something like "rgba(154, 45, 250, .9)"
 */
Rgba.prototype.toString = function () {
	return 'rgba('
		+ this.r + ', '
		+ this.g + ', '
		+ this.b + ', '
		+ (this.a === 0 || this.a === 1 ? this.a : this.a.toFixed(2)) + ')';
};

/**
 * @return {Object}				same color but in HSLA
 */
Rgba.prototype.toHsla = function () {
	var hsla = Convert.rgb2hsl(this);
	hsla.a = this.a;
	return new Color.hsla(hsla);
};


module.exports = Rgba;
