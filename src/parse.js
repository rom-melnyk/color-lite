'use strict';

const { RGB, RGBA, RGB_HEX, HSL, HSLA } = require('./constants');

const MASKS = {
    [HSL]: /^ *hsl\( *(\d{1,3}) *, *(100|\d{1,2}) *% *, *(100|\d{1,2}) *% *\) *$/i,
    [HSLA]: /^ *hsla\( *(\d{1,3}) *, *(100|\d{1,2}) *% *, *(100|\d{1,2}) *% *, *(1|0|\.\d+|0\.\d+) *\) *$/i,
    [RGB]: /^ *rgb\( *(\d{1,3}) *, *(\d{1,3}) *, *(\d{1,3}) *\) *$/i,
    [RGBA]: /^ *rgba\( *(\d{1,3}) *, *(\d{1,3}) *, *(\d{1,3}) *, *(1|0|\.\d+|0\.\d+) *\) *$/i,
    [RGB_HEX]: /^ *#?([0-9a-f]{3}|[0-9a-f]{6}) *$/i
};


/**
 * Parse the string color representation ("rgb(...)", "rgba(...)", "#...", "hsl(...)", "hsla(...)")
 * @param string
 * @returns {object}
 */
function parse(string) {
    let match = null;
    let format = null;
    Object.keys(MASKS).some((key) => {
        match = MASKS[key].exec(string);
        format = key;
        return match;
    });

    if (!match) {
        return { r: 0, g: 0, b: 0 };
    }

    if (format === RGB_HEX) {
        let channelsString = match[1];
        if (channelsString.length === 3) {
            // #abc --> #aabbcc
            channelsString = channelsString
                .split('')
                .reduce((result, channel) => result + channel + channel, '');
        }

        format = RGB;
        match.pop(); // remove #1; will be replaced by per-channel RGB values
        for (let i = 0; i < 6; i += 2) {
            const channel = channelsString.substr(i, 2);
            match.push( parseInt(channel, 16) );
        }
    }

    return format.split('').reduce((result, channel, i) => {
        result[channel] = +match[i + 1];
        return result;
    }, {});
}


module.exports = {
    MASKS,
    parse
};
