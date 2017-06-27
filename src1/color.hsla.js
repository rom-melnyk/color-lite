var Factory = require('./color.factory');
var Convert = require('./color.convert');
var Color = require('./color');

/**
 * @constructor
 * @param {Number|String|Object} h			hue value or the "hsla(...)" string or the {h:..., s:..., l:..., a:...} object
 * @param {Number} [s]						saturation value
 * @param {Number} [l]						brightness/luminosity value
 * @param {Number} [a]						alpha value
 * */
var Hsla = Factory('hsla');

/**
 * @override
 * @return {String}				something like "hsla(154, 45%, 50%, .9)"
 */
Hsla.prototype.toString = function () {
	return 'hsla('
		+ this.h + ', '
		+ this.s + '%, '
		+ this.l + '%, '
		+ (this.a === 0 || this.a === 1 ? this.a : this.a.toFixed(2)) + ')';
};

/**
 * @return {Object}				same but in RGBA
 */
Hsla.prototype.toRgba = function () {
	var rgba = Convert.hsl2rgb(this);
	rgba.a = this.a;
	return new Color.rgba(rgba);
};

module.exports = Hsla;
