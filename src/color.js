'use strict';

const normalize = require('./normalize');
const { rgb2hsl, hsl2rgb } = require('./convert');

const RGB_CHANNELS = ['r', 'g', 'b'];
const HSL_CHANNELS = ['h', 's', 'l'];
const ALL_CHANNELS = ['r', 'g', 'b', 'a', 'h', 's', 'l'];


class Color {
    constructor() {
        Object.defineProperty(this, '_data', { configurable: false, enumerable: false, value: {} });
        Object.defineProperty(this, '_shouldUpdate', { configurable: false, enumerable: false, writable: true });

        if (_isSequence(arguments)) {
            [ this.r, this.g, this.b, this.a ] = arguments;
            _assignHls(this);
        } else if (_isRgbObject(arguments)) {
            _assignRgb(this, arguments[0]);
            _assignHls(this);
        } else if (_isHslObject(arguments)) {
            _assignHls(this, arguments[0]);
            _assignRgb(this);
        } else {
            [ this.r, this.g, this.b, this.a ] = [ 0, 0, 0, 1 ];
            _assignHls(this);
        }
        this._shouldUpdate = true;

        // TODO remove me after testing
        // console.log(`r: ${this.r}, g: ${this.g}, b: ${this.b}`);
        // console.log(`h: ${this.h}, s: ${this.s}, l: ${this.l}`);
        // console.log(`a: ${this.a}`);
    }


    static normalize() { return normalize; }
    static rgb2hsl() { return rgb2hsl; }
    static hsl2rgb() { return hsl2rgb; }
    static RGB() { return 'rgb'; }
    static RGBA() { return 'rgba'; }
    static RGB_HEX() { return 'rgb_hex'; }
    static HSL() { return 'hsl'; }
    static HSLA() { return 'hsla'; }


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

        if (channels.a !== undefined) { // alpha channel; does not affect neither RGB not HSL
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

        if (shouldChange) { // RGB channels were changed
            _assignHls(this);
        } else {
            HSL_CHANNELS.forEach((ch) => {
                if (channels[ch] !== undefined) {
                    this[ch] = channels[ch];
                    shouldChange = true;
                }
            });

            if (shouldChange) { // HSL channels were changed
                _assignRgb(this);
            }
        }

        this._shouldUpdate = true;
        return this;
    }


    /**
     * Change the channel values by provided delta.
     * @param {{r: [number], g: [number], b: [number], h: [number], s: [number], l: [number], a: [number]}} channels
     * @return {Color}
     */
    tune(channels) {
        if (!channels) {
            return this;
        }

        const params = ALL_CHANNELS.reduce((params, ch) => {
            const delta = +channels[ch];
            if (!isNaN(delta)) {
                params[ch] = this[ch] + delta;
            }
            return params;
        }, {});

        return this.set(params);
    }



    clone() {
        return new Color(this);
    }


    toString(type) {
        switch (type) {
            case Color.RGB:
                return `rgb(${this.r}, ${this.g}, ${this.b})`;
            case Color.RGBA:
                return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
            case Color.HSL:
                return `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
            case Color.HSLA:
                return `hsla(${this.h}, ${this.s}%, ${this.l}%, ${this.a})`;
            default: // Color.RGB_HEX
                return `#${_toHex(this.r)}${_toHex(this.g)}${_toHex(this.b)}`;
        }
    }
}


function _isSequence(args) {
    return args.length >= 3;
}


function _isRgbObject(args) {
    return typeof args[0] === 'object' && RGB_CHANNELS.some(ch => args[0][ch] !== undefined);
}


function _isHslObject(args) {
    return typeof args[0] === 'object' && HSL_CHANNELS.some(ch => args[0][ch] !== undefined);
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


if (typeof window !== 'undefined') {
    window.Color = Color;
}

if (typeof module !== 'undefined') {
    module.exports = Color;
}
