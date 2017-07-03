'use strict';

const { RGB, RGBA, RGB_HEX, HSL, HSLA } = require('./constants');
const normalize = require('./normalize');
const { rgb2hsl, hsl2rgb } = require('./convert');
const { parse } = require('./parse');

const RGB_CHANNELS = ['r', 'g', 'b'];
const HSL_CHANNELS = ['h', 's', 'l'];


class Color {
    constructor() {
        Object.defineProperty(this, '_data', { configurable: false, enumerable: false, value: {} });
        Object.defineProperty(this, '_shouldUpdate', { configurable: false, enumerable: false, writable: true });

        if (arguments.length >= 3) {
            [ this.r, this.g, this.b, this.a ] = arguments;
            _assignHls(this);
        } else {
            let arg = arguments[0];
            if (typeof arg === 'string') {
                arg = parse(arg);
            }

            if (_looksLikeRgbObject(arg)) {
                if (_looksLikeHslObject(arg)) {
                    _warnAboutBadParams('new Color()', arg);
                }
                _assignRgb(this, arg);
                _assignHls(this);
            } else if (_looksLikeHslObject(arg)) {
                _assignHls(this, arg);
                _assignRgb(this);
            } else {
                [ this.r, this.g, this.b, this.a ] = [ 0, 0, 0, 1 ];
                _assignHls(this);
            }
        }
        this._shouldUpdate = true;

        // TODO remove me after testing
        // console.log(`r: ${this.r}, g: ${this.g}, b: ${this.b}`);
        // console.log(`h: ${this.h}, s: ${this.s}, l: ${this.l}`);
        // console.log(`a: ${this.a}`);
    }


    static get RGB() { return RGB; }
    static get RGBA() { return RGBA; }
    static get RGB_HEX() { return RGB_HEX; }
    static get HSL() { return HSL; }
    static get HSLA() { return HSLA; }


    // ---------------- RGB ----------------
    set r(v) {
        this._data._r = normalize.r(v);
        if (this._shouldUpdate) {
            _assignHls(this);
        }
    }
    get r() {
        return this._data._r;
    }

    set g(v) {
        this._data._g = normalize.g(v);
        if (this._shouldUpdate) {
            _assignHls(this);
        }
    }
    get g() {
        return this._data._g;
    }

    set b(v) {
        this._data._b = normalize.b(v);
        if (this._shouldUpdate) {
            _assignHls(this);
        }
    }
    get b() {
        return this._data._b;
    }


    // ---------------- HSL ----------------
    set h(v) {
        this._data._h = normalize.h(v);
        if (this._shouldUpdate) {
            _assignRgb(this);
        }
    }
    get h() {
        return this._data._h;
    }

    set s(v) {
        this._data._s = normalize.s(v);
        if (this._shouldUpdate) {
            _assignRgb(this);
        }
    }
    get s() {
        return this._data._s;
    }

    set l(v) {
        this._data._l = normalize.l(v);
        if (this._shouldUpdate) {
            _assignRgb(this);
        }
    }
    get l() {
        return this._data._l;
    }


    // ---------------- alpha ----------------
    set a(v) {
        this._data._a = normalize.a(v);
    }
    get a() {
        return this._data._a;
    }


    /**
     * Set the channel values.
     * @param {{r: [number], g: [number], b: [number], h: [number], s: [number], l: [number], a: [number]}} channels
     * @return {Color}
     */
    set(channels) {
        if (!channels) {
            return this;
        }

        if (channels.a !== undefined) { // alpha channel; does not affect neither RGB nor HSL
            this.a = channels.a;
        }

        let shouldChange = false;
        this._shouldUpdate = false;
        RGB_CHANNELS.forEach((ch) => {
            if (channels[ch] !== undefined) {
                this[ch] = channels[ch];
                shouldChange = true;
            }
        });

        if (shouldChange) { // RGB channels were changed; update HSL channels accordingly
            _assignHls(this);
            if (_looksLikeHslObject(channels)) {
                _warnAboutBadParams('color.set()', channels);
            }
        } else {
            HSL_CHANNELS.forEach((ch) => {
                if (channels[ch] !== undefined) {
                    this[ch] = channels[ch];
                    shouldChange = true;
                }
            });

            if (shouldChange) { // HSL channels were changed; update RGB channels accordingly
                _assignRgb(this);
            }
        }

        this._shouldUpdate = true;
        return this;
    }


    /**
     * Change the channel values by provided delta.
     * @param {{r: [number], g: [number], b: [number], h: [number], s: [number], l: [number], a: [number]}} deltas
     * @return {Color}
     */
    tune(deltas) {
        if (!deltas) {
            return this;
        }

        if (_looksLikeRgbObject(deltas) && _looksLikeHslObject(deltas)) {
            _warnAboutBadParams('color.tune()', deltas);
        }

        const params = {};
        RGB_CHANNELS.reduce((params, ch) => _enrichTuneObjectWithChannelValue(params, deltas, this, ch), params);
        if (Object.keys(params).length === 0) { // no RGB params found; it's safe to forward HSL params
            HSL_CHANNELS.reduce((params, ch) => _enrichTuneObjectWithChannelValue(params, deltas, this, ch), params);
        }

        _enrichTuneObjectWithChannelValue(params, deltas, this, 'a'); // alpha channel is handled independently
        return this.set(params);
    }



    clone() {
        // If clone RGB channels, HSL gray (s === 0) is corrupted because Hue is considered as zero for any grey color
        return new Color({ h: this.h, s: this.s, l: this.l, a: this.a });
    }


    toString(type) {
        switch (type) {
            case RGB:
                return `rgb(${this.r}, ${this.g}, ${this.b})`;
            case RGBA:
                return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
            case HSL:
                return `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
            case HSLA:
                return `hsla(${this.h}, ${this.s}%, ${this.l}%, ${this.a})`;
            default: // RGB_HEX
                return `#${_toHex(this.r)}${_toHex(this.g)}${_toHex(this.b)}`;
        }
    }
}


function _looksLikeRgbObject(arg) {
    return typeof arg === 'object' && RGB_CHANNELS.some(ch => arg[ch] !== undefined);
}


function _looksLikeHslObject(arg) {
    return typeof arg === 'object' && HSL_CHANNELS.some(ch => arg[ch] !== undefined);
}


function _toHex(channel) {
    const hex = channel.toString(16);
    return hex.length === 2 ? hex : `0${hex}`;
}


function _assignRgb(instance, values) {
    const prevShouldConvert = instance._shouldUpdate;
    instance._shouldUpdate = false;
    if (values) {
        ({ r: instance.r, g: instance.g, b: instance.b, a: instance.a } = values);
    } else {
        ({ r: instance.r, g: instance.g, b: instance.b } = hsl2rgb(instance));
    }
    instance._shouldUpdate = prevShouldConvert;
}


function _assignHls(instance, values) {
    const prevShouldConvert = instance._shouldUpdate;
    instance._shouldUpdate = false;
    if (values) {
        ({ h: instance.h, s: instance.s, l: instance.l, a: instance.a } = values);
    } else {
        ({ h: instance.h, s: instance.s, l: instance.l } = rgb2hsl(instance));
    }
    instance._shouldUpdate = prevShouldConvert;
}


function _enrichTuneObjectWithChannelValue(obj, newValues, currentValues, chName) {
    const delta = +newValues[ chName ];
    if (!isNaN(delta)) {
        obj[ chName ] = currentValues[ chName ] + delta;
    }
    return obj;
}


function _warnAboutBadParams(area, obj) {
    if (console && typeof console.warn === 'function') {
        console.warn(`[ ${area} ]: both RGB and HSL props appeared together. HSL ones are ignored!`, obj);
    }
}


if (typeof window !== 'undefined') {
    window.Color = Color;
}

if (typeof module !== 'undefined') {
    module.exports = Color;
}
