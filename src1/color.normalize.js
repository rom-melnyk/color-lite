/**
 * Normalizes the value according the rules for appropriate channel
 * @param {String} channel			one char from the "rgbahsl"
 * @param {*} value
 * @return {Number}					the normalized value respecting channel-specific rules
 */
function normalizeChannel (channel, value) {
	var minLimit, maxLimit, minValue, maxValue;
	minLimit = minValue = 0;

	channel = channel.toLowerCase();
	if (channel === 'r' || channel === 'g' || channel === 'b') {
		maxLimit = maxValue = 255;
	} else if (channel === 'a') {
		value = parseFloat(value);
		value = isNaN(value) ? 1 : value;
		maxLimit = maxValue = 1;
	} else if (channel === 'h') {
		value = parseInt(value) || 0;
		minValue = 360 - (360 - value) % 360; // circular rolling if < 0
		maxLimit = 360;
		maxValue = value % 360
	} else if (channel === 's' || channel === 'l') {
		maxLimit = maxValue = 100;
	}

	if (typeof value !== 'number') {
		value = parseInt(value) || 0;
	}

	if (value > maxLimit) {
		return maxValue;
	} else if (value < minLimit) {
		return minValue
	} else {
		return value;
	}
}

module.exports = normalizeChannel;
