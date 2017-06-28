'use strict';

const normalize = require('./normalize');
const { rgb2hsl, hsl2rgb } = require('./convert');

class Color {
    constructor() {
        Object.defineProperty(this, '_data', { configurable: false, enumerable: false, value: {} });
        Object.defineProperty(this, '_shouldConvert', { configurable: false, enumerable: false, writable: true });

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
        this._shouldConvert = true;

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
        if (this._shouldConvert) {
            _assignHls(this);
        }
    }
    get r() {
        return this._data._r;
    }

    set g(v) {
        this._data._g = normalize.g(v);
        if (this._shouldConvert) {
            _assignHls(this);
        }
    }
    get g() {
        return this._data._g;
    }

    set b(v) {
        this._data._b = normalize.b(v);
        if (this._shouldConvert) {
            _assignHls(this);
        }
    }
    get b() {
        return this._data._b;
    }


    // ---------------- HSL ----------------
    set h(v) {
        this._data._h = normalize.h(v);
        if (this._shouldConvert) {
            _assignRgb(this);
        }
    }
    get h() {
        return this._data._h;
    }

    set s(v) {
        this._data._s = normalize.s(v);
        if (this._shouldConvert) {
            _assignRgb(this);
        }
    }
    get s() {
        return this._data._s;
    }

    set l(v) {
        this._data._l = normalize.l(v);
        if (this._shouldConvert) {
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


    set(channels) {
        if (!channels) {
            return this;
        }

        if (channels.a !== undefined) { // alpha channel; does not affect neither RGB not HSL
            this.a = channels.a;
        }

        let wasChanged = false;
        this._shouldConvert = false;
        if (channels.r !== undefined) {
            this.r = channels.r;
            wasChanged = true;
        }
        if (channels.g !== undefined) {
            this.g = channels.g;
            wasChanged = true;
        }
        if (channels.b !== undefined) {
            this.b = channels.b;
            wasChanged = true;
        }

        if (wasChanged) { // RGB channels were changed
            _assignHls(this);
        } else {
            if (channels.h !== undefined) {
                this.h = channels.h;
                wasChanged = true;
            }
            if (channels.s !== undefined) {
                this.s = channels.s;
                wasChanged = true;
            }
            if (channels.l !== undefined) {
                this.l = channels.l;
                wasChanged = true;
            }

            if (wasChanged) { // HSL channels were changed
                _assignRgb(this);
            }
        }

        this._shouldConvert = true;
        return this;
    }


    tune(channels) {
        // TODO
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
            default:
                return `#${_hex(this.r)}${_hex(this.g)}${_hex(this.b)}`;
        }
    }
}


function _isSequence(args) {
    return args.length >= 3;
}


function _isRgbObject(args) {
    return args[0] && args[0].r !== undefined && args[0].g !== undefined && args[0].b !== undefined;
}


function _isHslObject(args) {
    return args[0] && args[0].h !== undefined && args[0].s !== undefined && args[0].l !== undefined;
}


function _hex(channel) {
    const hex = channel.toString(16);
    return hex.length === 2 ? hex : `0${hex}`;
}


function _assignRgb(instance, values) {
    const prevShouldConvert = instance._shouldConvert;
    instance._shouldConvert = false;
    if (values) {
        ({ r: instance.r, g: instance.g, b: instance.b, a: instance.a } = values);
    } else {
        ({ r: instance.r, g: instance.g, b: instance.b } = hsl2rgb(instance));
    }
    instance._shouldConvert = prevShouldConvert;
}


function _assignHls(instance, values) {
    const prevShouldConvert = instance._shouldConvert;
    instance._shouldConvert = false;
    if (values) {
        ({ h: instance.h, s: instance.s, l: instance.l, a: instance.a } = values);
    } else {
        ({ h: instance.h, s: instance.s, l: instance.l } = rgb2hsl(instance));
    }
    instance._shouldConvert = prevShouldConvert;
}


if (typeof window !== 'undefined') {
    window.Color = Color;
}

if (module) {
    module.exports = Color;
}
