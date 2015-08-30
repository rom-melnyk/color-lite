var Color = {};
module.exports = Color;

Color.rgb = require('./color.rgb');
Color.rgba = require('./color.rgba');
Color.hsl = require('./color.hsl');
Color.hsla = require('./color.hsla');
Color.convert = require('./color.convert');

if (window && !window.$color) { window.$color = Color; }
