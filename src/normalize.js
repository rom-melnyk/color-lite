'use strict';


function normalize(value, min, max, _default, isFloat = false) {
    value = isFloat ? parseFloat(value) : parseInt(value);

    if (isNaN(value)) {
        return _default;
    }

    return Math.max(min, Math.min(value, max));
}


function wrap(value, min, max, _default) {
    value = parseInt(value);

    if (isNaN(value)) {
        return _default;
    }

    if (value < min) {
        return max - (max - value) % max;
    }

    if (value >= max) {
        return value % max;
    }

    return value;
}


module.exports = {
    r: v => normalize(v, 0, 255, 0),
    g: v => normalize(v, 0, 255, 0),
    b: v => normalize(v, 0, 255, 0),

    h: v => wrap(v, 0, 360, 0),
    s: v => normalize(v, 0, 100, 0),
    l: v => normalize(v, 0, 100, 0),

    a: v => normalize(v, 0, 1, 1, true)
};
