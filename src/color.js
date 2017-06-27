'use strict';

const normalize = require('./normalize');

class Color {
    constructor() {
        Object.defineProperty(this, '_data', {configurable: false, enumerable: false});
        Object.defineProperty(this, '_shouldConvert', {configurable: false, enumerable: false});
        this._shouldConvert = false;

        if (_isSequence(arguments)) {
            this.r = arguments[0];
            this.g = arguments[1];
            this.b = arguments[2];
            this.a = arguments[3];

        }
        this._shouldConvert = true;
    }


    static normalize() {
        return normalize;
    }


    // ---------------- RGB ----------------
    set r(v) {
        this._data._r = normalize.r(v);
        if (this._shouldConvert) {___}
    }
    get r() {
        return this._data._r;
    }

    set g(v) {
        this._data._g = normalize.g(v);
        if (this._shouldConvert) {___}
    }
    get g() {
        return this._data._g;
    }

    set b(v) {
        this._data._b = normalize.b(v);
        if (this._shouldConvert) {___}
    }
    get b() {
        return this._data._b;
    }


    // ---------------- HSL ----------------
    set h(v) {
        this._data._h = normalize.h(v);
        if (this._shouldConvert) {___}
    }
    get h() {
        return this._data._h;
    }

    set s(v) {
        this._data._s = normalize.s(v);
        if (this._shouldConvert) {___}
    }
    get s() {
        return this._data._s;
    }

    set l(v) {
        this._data._l = normalize.l(v);
        if (this._shouldConvert) {___}
    }
    get l() {
        return this._data._l;
    }


    // ---------------- alpha ----------------
    set a(v) {
        this._data._a = normalize.a(v);
        if (this._shouldConvert) {___}
    }
    get a() {
        return this._data._a;
    }
}


function _isSequence(args) {
    return args.length >= 3;
}


if (window) {
    window.Color = Color;
}

if (module) {
    module.exports = Color;
}
