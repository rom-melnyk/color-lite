(function (color) {
	/**
	 * @constructor
	 * @param {Number|String} h				hue value or the "hsl(...)" string
	 * @param {Number} [s]						saturation value
	 * @param {Number} [l]						brightness/luminosity value
	 * @param {Number} [a]						alpha value
	 * */
	color.hsla = function (h, s, l, a) {
		var me = this;
		// Attempt to parse from the "hsla(...)" string.
		// If fail, sets values to `undefined` which will be casted to zeros.
		if (typeof h === 'string' && color.masks.hsla.test(h)) {
			var parsedString = color.masks.hsla.exec(h);
			h = parsedString[1];
			s = parsedString[2].replace('%', '');
			l = parsedString[3].replace('%', '');
			a = parsedString[4];
		}

		/**
		 * @private
		 * Utility; assigns the value to the given property of `this` respecting the range constraints
		 * @param {String} prop							there will be `me[prop]` created
		 * @param {Number} value
		 * @param {Number} fromLimit					the value constraints
		 * @param {Number} fromValue
		 * @param {Number} toLimit
		 * @param {Number} toValue
		 */
		var setProperty = function (prop, value, fromLimit, fromValue, toLimit, toValue) {
			if (value < fromLimit) {
				me[prop] = fromValue;
			} else if (value > toLimit) {
				me[prop] = toValue;
			} else {
				me[prop] = value;
			}
		};

		/**
		 * Sets the HSLA components
		 * @param {Object} shift			like `{h: 30, s: -10, l: 50, a: -.3}`. Properties are not mandatory.
		 */
		me.set = function (shift) {
			if (typeof shift !== 'object') {
				shift = {};
			}

			['h', 's', 'l', 'a'].forEach(function (key) {
				if (typeof shift[key] === 'number') {
					me.set[key](shift[key]);
				}
			});

			return me;
		};

		// Setters for each component respecting special constraints
		me.set.h = function (h) {
			setProperty('h', parseInt(h) || 0, 0, 360 - (360 - h) % 360, 360, h % 360);
		};
		me.set.s = function (s) {
			setProperty('s', parseInt(s) || 0, 0, 0, 100, 100);
		};
		me.set.l = function (l) {
			setProperty('l', parseInt(l) || 0, 0, 0, 100, 100);
		};
		me.set.a = function (a) {
			a = parseFloat(a);
			setProperty('a', isNaN(a) ? 1 : a, 0, 0, 1, 1);
		};

		/**
		 * Tunes the HSLA components
		 * @param {Object} shift			like `{h: 30, s: -10, l: 50, a: -.3}`. Properties are not mandatory.
		 */
		me.tune = function (shift) {
			if (typeof shift !== 'object') {
				return me;
			}

			['h', 's', 'l', 'a'].forEach(function (key) {
				if (typeof shift[key] === 'number') {
					me.set[key](me[key] + shift[key]);
				}
			});

			return me;
		};

		/**
		 * @override
		 * @return {String}				something like "hsla(154, 45%, 50%, .9)"
		 */
		me.toString = function () {
			return 'hsla('
				+ me.h + ', '
				+ me.s + '%, '
				+ me.l + '%, '
				+ me.a + ')';
		};

		/**
		 * Clones the instance
		 */
		me.clone = function () {
			return new me.constructor(me.h, me.s, me.l, me.a);
		};

		// actually, create the object
		me.set.h(h);
		me.set.s(s);
		me.set.l(l);
		me.set.a(a);
	};

})(window.$color);
