var Factory = require('./color.factory');
var Convert = require('./color.convert');
var Color = require('./color');

/**
 * @constructor
 * @param {Number|String|Object} r			Red value or the "rgb(...)" string or the {r:..., g:..., b:...} object
 * @param {Number} [g]						Green value
 * @param {Number} [b]						Blue value
 * */
var Rgb = Factory('rgb');

/**
 * @override
 * @param [hex=false]			if set to "hex", makes the output like "#ba5e7f"
 * @return {String}				something like "rgba(154, 45, 250)" or "#ba5e7f"
 */
Rgb.prototype.toString = function (hex) {
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
Rgb.prototype.toHsl = function () {
	return new Color.hsl(
		Convert.rgb2hsl(this)
	);
};

module.exports = Rgb;
