/**
 * @private
 * @factory
 * Creates the constructor for any type of the color: RGB(a), HSL(a).
 * The constructor will create following instance (respecting channels):
 * {
 * 		r:..., g:..., b:...,
 * 		set: function ({}) {...},
 * 			set.r: function () {...},
 * 			set.g: function () {...},
 * 			set.b: function () {...},
 * 		tune: function ({}) {...},
 * 			tune.r: function () {...},
 * 			tune.g: function () {...},
 * 			tune.b: function () {...},
 * 		toString: function () {...},
 * 		clone: function () {...}
 * }
 * @param {String} type					defines the type of the color representation
 * @return {Function}					the constructor like $color.hsla()
 */
;(function (color) {
	color.__Factory__ = function (type) {
		return function () {
			var me = this,
				channelValues;

			me.type = type;

			// call the `$color.parse` with current arguments and the `type` argument preceding
			var args = [].slice.call(arguments);
			args.unshift(me.type);
			channelValues = color.parse.apply(color, args);

			var channelNames = me.type.split('');

			/**
			 * Set or tune the channel values
			 * @param {Object} channels			like `{h: 30, s: 10, l: 50, a: 1}`. Properties are not mandatory.
			 */
			// create the `.set()` and `.tune()` methods
			['set', 'tune'].forEach(function (fName) {
				me[fName] = function (channels) {
					if (typeof channels !== 'object') {
						return me;
					}

					channelNames.forEach(function (ch) {
						if (typeof channels[ch] === 'number') {
							me[fName][ch]( channels[ch] );
						}
					});

					return me;
				};
			});

			// The `.toString()` method must be overridden before use!
			// me.toString = function () {};

			/**
			 * Clones the instance
			 * @return {Object}
			 */
			me.clone = function () {
				return new me.constructor(
					// serialize the channel values as the object
					(function () {
						var ret = {};
						channelNames.forEach(function (ch) {
							ret[ch] = me[ch];
						});
						return ret;
					})()
				);
			};

			// initialize the instance; set the channels; create per-channel setters and tuners
			channelNames.forEach(function (ch) {
				me[ch] = channelValues[ch];
				// setters and tuners for each channel
				(function (_c) {
					me.set[_c] = function (val) {
						me[_c] = color.normalizeChannel(_c, val);
						return me;
					};
					me.tune[_c] = function (val) {
						if (typeof val === 'number') {
							me[_c] = color.normalizeChannel(_c, me[_c] + val);
						}
						return me;
					};
				})(ch);
			});
		};
	}
})(window.$color);
