'use strict';

const assert = require('assert');
const sinon = require('sinon');
const Color = require('../src/color-lite');

describe('Color constructor', () => {
    it('should behave like constructor', () => {
        const color = new Color();
        assert(color instanceof Color);
        ['r', 'g', 'b', 'a', 'h', 's', 'l'].forEach((channel) => {
            assert(color[channel] !== undefined);
        })
    });

    it('should create Color instance from sequence of numbers', () => {
        const { r, g, b, a } = new Color(0xaa, 0x88, 0x33);
        // r: 170, g: 136, b: 51
        // h: 43, s: 54, l: 43
        // a: 1
        assert.deepEqual({ r, g, b, a }, { r: 0xaa, g: 0x88, b: 0x33, a: 1 });
    });

    it('should create Color instance from rgba() string', () => {
        const { r, g, b, a } = new Color('rgba(135, 215, 100, .3)');
        assert.deepEqual({ r, g, b, a }, { r: 135, g: 215, b: 100, a: .3 });
    });

    it('should create Color instance from hsla() string', () => {
        const { h, s, l, a } = new Color('hsla(240, 99%, 13%, .25)');
        assert.deepEqual({ h, s, l, a }, { h: 240, s: 99, l: 13, a: .25 });
    });

    it('should create Color instance from #... string', () => {
        const { r, g, b } = new Color('#adceb1');
        assert.deepEqual({ r, g, b }, { r: 0xad, g: 0xce, b: 0xb1 });
    });

    it('should create HSL channels if RGB values are set', () => {
        const { h, s, l } = new Color({ r: 0xaa, g: 0x88, b: 0x33 });
        // channel values might differ by 1 from expected ones due to rounding
        assert(Math.abs(h - 43) <= 1);
        assert(Math.abs(s - 54) <= 1);
        assert(Math.abs(l - 43) <= 1);
    });

    it('should create RGB channels if HSL values are set', () => {
        const { r, g, b } = new Color({ h: 43, s: 54, l: 43 });
        // channel values might differ by 1 from expected ones due to rounding
        assert(Math.abs(r - 0xaa) <= 1);
        assert(Math.abs(g - 0x88) <= 1);
        assert(Math.abs(b - 0x33) <= 1);
    });

    it('should produce console.warn() when mixin RGB and HSL channels', () => {
        const spy = sinon.spy(console, 'warn');
        const color = new Color({ r: 45, h: 100 });
        assert(console.warn.called);
        console.warn.restore();
    });

    it('should clone', () => {
        const color = new Color(Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.random());
        const clone = color.clone();
        assert(color !== clone);
        assert.deepStrictEqual(color, clone);
        assert(color.toString(Color.HSLA) === clone.toString(Color.HSLA));
    });

    it('should clone gray colors', () => { // @see note in color-lite.js#clone()
        const color = new Color({h: 240, s: 0, l: 50});
        const clone = color.clone();
        color.h += 20;
        clone.h += 20;
        assert(color.toString(Color.HSL) === clone.toString(Color.HSL));
    });
});

