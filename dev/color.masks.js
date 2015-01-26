/**
 * The RegExp masks for the "hsl()", "hsla()", "rgb()", "rgba()" representations.
 */
;(function (color) {
	color.masks = {};
	color.masks.hsl 	= /^ *hsl\( *(\d{1,3}), *(100|\d{1,2}%), *(100|\d{1,2}%) *\) *$/;
	color.masks.hsla 	= /^ *hsla\( *(\d{1,3}), *(100|\d{1,2}%), *(100|\d{1,2}%), *(1|0|\.\d+|0\.\d+) *\) *$/;
	color.masks.rgb 	= /^ *rgb\( *(\d{1,3}), *(\d{1,3}), *(\d{1,3}) *\) *$/;
	color.masks.rgba 	= /^ *rgba\( *(\d{1,3}), *(\d{1,3}), *(\d{1,3}), *(1|0|\.\d+|0\.\d+) *\) *$/;
	color.masks.rgbhex 	= /^ *#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6}) *$/;
})(window.$color);
