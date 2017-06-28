const assert = require('assert');

const Color = require('../src/color');

describe('Color constructor', () => {
    'use strict';

    it('should create Color instance from sequence of numbers', () => {
        const color = new Color(0xaa, 0x88, 0x33);
        // r: 170, g: 136, b: 51
        // h: 43, s: 54, l: 43
        // a: 1
        assert(color.r, 0xaa);
        assert(color.g, 0x88);
        assert(color.b, 0x33);
        assert.equal(color.a, 1);
    });

    it('should create HSL channels if RGB values are set', () => {
        const color = new Color({ r: 0xaa, g: 0x88, b: 0x33 });
        assert(color.h, 43);
        assert(color.s, 54);
        assert(color.l, 43);
    });

    it('should create RGB channels if HSL values are set', () => {
        const color = new Color({ h: 43, s: 54, l: 43 });
        assert(color.r, 0xaa);
        assert(color.g, 0x88);
        assert(color.b, 0x33);
    });

    it('should change color when RGB channels were changed (one by one)', () => {
        const color = new Color({ r: 12, g: 8, b: 0x33 });
        color.r = 0xbb;
        color.g = 0xff;
        assert.equal(color.toString(), '#bbff33');
    });

    it('should change color when RGB channels were changed (bundle)', () => {
        const color = new Color({ r: 255, g: 255, b: 13 });
        color.set({ r: 0xa9, g: 0x87, b: 0x65 });
        assert.equal(color.toString(), '#a98765');
    });

    it('should change HLS values when RGB channels were changed', () => {
        const color = new Color({ r: 0, g: 1, b: 2 });
        color.set({ r: 169, g: 34, b: 13 }); // http://www.rapidtables.com/convert/color/rgb-to-hsl.htm
        assert.equal(color.toString(Color.HSL), 'hsl(8, 86%, 36%)');
    });

    it('should change RGB values when HSL channels were changed', () => {
        const color = new Color({ r: 0, g: 1, b: 2 });
        color.set({ h: 169, s: 34, l: 13 }); // http://www.rapidtables.com/convert/color/hsl-to-rgb.htm
        assert.equal(color.toString(Color.RGB), 'rgb(22, 44, 40)');
    });

    it('clones', () => {
        const color = new Color(Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.random());
        const clone = color.clone();
        assert(color !== clone);
        assert.deepStrictEqual(color, clone);
        assert(color.toString(Color.HSLA) === clone.toString(Color.HSLA));
    });

    it('should tune RGB respecting constraints', () => {
        const color = new Color(15, 100, 35);
        color.tune({ r: -55, g: -30, b: 35 });
        assert.equal(color.toString(Color.RGB), 'rgb(0, 70, 70)');
    });

    it('should tune HSL respecting constraints', () => {
        const color = new Color({ h: 60, s: 50, l: 90 });
        color.tune({ h: 500, s: -30, l: 5 });
        assert.equal(color.toString(Color.HSL), 'hsl(200, 20%, 95%)');
    });
});

