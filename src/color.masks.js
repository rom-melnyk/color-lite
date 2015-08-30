/**
 * The RegExp masks for the "hsl()", "hsla()", "rgb()", "rgba()" representations.
 */
var masks = {};
masks.hsl 	= /^ *hsl\( *(\d{1,3}), *(100|\d{1,2}%), *(100|\d{1,2}%) *\) *$/i;
masks.hsla 	= /^ *hsla\( *(\d{1,3}), *(100|\d{1,2}%), *(100|\d{1,2}%), *(1|0|\.\d+|0\.\d+) *\) *$/i;
masks.rgb 	= /^ *rgb\( *(\d{1,3}), *(\d{1,3}), *(\d{1,3}) *\) *$/i;
masks.rgba 	= /^ *rgba\( *(\d{1,3}), *(\d{1,3}), *(\d{1,3}), *(1|0|\.\d+|0\.\d+) *\) *$/i;
masks.rgbhex 	= /^ *#?([0-9a-f]{3}|[0-9a-f]{6}) *$/i;

module.exports = masks;
