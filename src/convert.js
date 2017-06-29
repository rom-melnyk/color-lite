'use strict';

/**
 * Converts RGB color to HSL.
 * http://www.rapidtables.com/convert/color/rgb-to-hsl.htm
 * @param {{r: number, g: number, b: number}} channels
 * @return {{h: number, s: number, l: number}}
 */
function rgb2hsl({r, g, b}) {
    r = r / 255;
    g = g / 255;
    b = b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let h;
    let s;
    let l;

    if (delta === 0) {
        h = 0;
    } else {
        if (r === max) {
            h = (g - b) / delta % 6;
        } else if (g === max) {
            h = (b - r) / delta + 2;
        } else /* if (b === max) */{
            h = (r - g) / delta + 4
        }
    }
    h = Math.round(h * 60);

    l = (max + min) / 2;

    s = (l === 0 || l === 1)
        ? 0
        : (delta / (1 - Math.abs(2 * l - 1)));

    s = Math.round(100 * s);
    l = Math.round(100 * l);
    return {h, s, l};
}


/**
 * Converts HSL color to RGB.
 * http://www.rapidtables.com/convert/color/hsl-to-rgb.htm
 * @param {{h: number, s: number, l: number}} channels
 * @return {{r: number, g: number, b: number}}
 */
function hsl2rgb({h, s, l}) {
     s = s / 100;
     l = l / 100;
     const C = (1 - Math.abs(2 * l - 1)) * s;
     const X = C * (1 - Math.abs(h / 60 % 2 - 1));
     const M = l - C / 2;
     let rgb;

    if ((h >= 0) && (h < 60)) {
        rgb = { r: C, g: X, b: 0 };
    } else if ((h >= 60) && (h < 120)) {
        rgb = { r: X, g: C, b: 0 };
    } else if ((h >= 120) && (h < 180)) {
        rgb = { r: 0, g: C, b: X };
    } else if ((h >= 180) && (h < 240)) {
        rgb = { r: 0, g: X, b: C };
    } else if ((h >= 240) && (h < 300)) {
        rgb = { r: X, g: 0, b: C };
    } else /*if ((h >= 300) && (h < 360))*/ {
        rgb = { r: C, g: 0, b: X };
    }

    Object.keys(rgb).forEach((ch) => {
        rgb[ ch ] = Math.round((rgb[ ch ] + M) * 255);
    });

    return rgb;
}


module.exports = {
    rgb2hsl,
    hsl2rgb
};
