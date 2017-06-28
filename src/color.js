'use strict';

const normalize = require('./normalize');
const { rgb2hsl, hsl2rgb } = require('./convert');

class Color {
    constructor() {
        Object.defineProperty(this, '_data', { configurable: false, enumerable: false, value: {} });
        Object.defineProperty(this, '_shouldConvert', { configurable: false, enumerable: false, writable: true });
        this._shouldConvert = false;

        if (_isSequence(arguments)) {
            this.r = arguments[0];
            this.g = arguments[1];
            this.b = arguments[2];
            this.a = arguments[3];
            ({ h: this.h, s: this.s, l: this.l } = rgb2hsl(this));
        } else if (_isRgbObject(arguments)) {
            this.r = arguments[0].r;
            this.g = arguments[0].g;
            this.b = arguments[0].b;
            this.a = arguments[0].a;
            ({ h: this.h, s: this.s, l: this.l } = rgb2hsl(this));
        } else if (_isHslObject(arguments)) {
            this.h = arguments[0].h;
            this.s = arguments[0].s;
            this.l = arguments[0].l;
            this.a = arguments[0].a;
            ({ r: this.r, g: this.g, b: this.b } = hsl2rgb(this));
        }
        this._shouldConvert = true;

        // TODO remove me after testing
        console.log(`r: ${this.r}, g: ${this.g}, b: ${this.b}`);
        console.log(`h: ${this.h}, s: ${this.s}, l: ${this.l}`);
        console.log(`a: ${this.a}`);
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
            ({ h: this.h, s: this.s, l: this.l } = rgb2hsl(this));
        }
    }
    get r() {
        return this._data._r;
    }

    set g(v) {
        this._data._g = normalize.g(v);
        if (this._shouldConvert) {
            ({ h: this.h, s: this.s, l: this.l } = rgb2hsl(this));
        }
    }
    get g() {
        return this._data._g;
    }

    set b(v) {
        this._data._b = normalize.b(v);
        if (this._shouldConvert) {
            ({ h: this.h, s: this.s, l: this.l } = rgb2hsl(this));
        }
    }
    get b() {
        return this._data._b;
    }


    // ---------------- HSL ----------------
    set h(v) {
        this._data._h = normalize.h(v);
        if (this._shouldConvert) {
            ({ r: this.r, g: this.g, b: this.b } = hsl2rgb(this));
        }
    }
    get h() {
        return this._data._h;
    }

    set s(v) {
        this._data._s = normalize.s(v);
        if (this._shouldConvert) {
            ({ r: this.r, g: this.g, b: this.b } = hsl2rgb(this));
        }
    }
    get s() {
        return this._data._s;
    }

    set l(v) {
        this._data._l = normalize.l(v);
        if (this._shouldConvert) {
            ({ r: this.r, g: this.g, b: this.b } = hsl2rgb(this));
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
    return ('0' + channel.toString(16)).substr(-2, 2);
}


if (typeof window !== 'undefined') {
    window.Color = Color;
}

if (module) {
    module.exports = Color;
}
