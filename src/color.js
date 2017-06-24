'use strict';

const normalize = require('./normalize');

class Color {
    constructor() {
        this._r = 0;
        this._g = 0;
        this._b = 0;

        this._h = 0;
        this._s = 0;
        this._l = 0;

        this._a = 0;
    }


    static normalize() {
        return normalize;
    }
}

if (window) {
    window.Color = Color;
}

if (module) {
    module.exports = Color;
}
