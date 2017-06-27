var Factory = require('./color.factory');
var Convert = require('./color.convert');
var Color = require('./color');

/**
 * @constructor
 * @param {Number|String|Object} h			hue value or the "hsl(...)" string or the {h:..., s:..., l:..., a:...} object
 * @param {Number} [s]						saturation value
 * @param {Number} [l]						brightness/luminosity value
 * */
var Hsl = Factory('hsl');

/**
 * @override
 * @return {String}				something like "hsl(154, 45%, 50%)"
 */
Hsl.prototype.toString = function () {
	return 'hsl('
		+ this.h + ', '
		+ this.s + '%, '
		+ this.l + '%)';
};

/**
 * @return {Object}				same but in RGB
 */
Hsl.prototype.toRgb = function () {
	return new Color.rgb(
		Convert.hsl2rgb(this)
	);
};

module.exports = Hsl;
