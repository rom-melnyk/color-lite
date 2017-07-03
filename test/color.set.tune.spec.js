'use strict';

const assert = require('assert');
const sinon = require('sinon');
const Color = require('../src/color-lite');


describe('Color .set()', () => {
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

    it('should change color when HSL channels were changed (one by one)', () => {
        const color = new Color({ r: 12, g: 8, b: 0x33 });
        color.h = 300;
        color.l = 35;
        assert.equal(color.toString(Color.HSL), 'hsl(300, 73%, 35%)');
    });

    it('should change color when HSL channels were changed (bundle)', () => {
        const color = new Color({ r: 255, g: 255, b: 13 });
        color.set({ h: 35, s: 15, l: 59 });
        assert.equal(color.toString(Color.HSL), 'hsl(35, 15%, 59%)');
    });

    it('should change HLS values when RGB channels were changed', () => {
        const color = new Color({ h: 100, s: 10, l: 5 });
        color.set({ r: 169, g: 34, b: 13 }); // http://www.rapidtables.com/convert/color/rgb-to-hsl.htm
        assert.equal(color.toString(Color.HSL), 'hsl(8, 86%, 36%)');
    });

    it('should change RGB values when HSL channels were changed', () => {
        const color = new Color({ r: 0, g: 1, b: 2 });
        color.set({ h: 169, s: 34, l: 13 }); // http://www.rapidtables.com/convert/color/hsl-to-rgb.htm
        assert.equal(color.toString(Color.RGB), 'rgb(22, 44, 40)');
    });

    it('should produce console.warn() when mixin RGB and HSL channels', () => {
        const spy = sinon.spy(console, 'warn');
        const color = new Color('#8a4');
        color.set({ r: 50, h: -180 });
        assert(console.warn.called);
        console.warn.restore();
    });
});


describe('Color .tune()', () => {
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

    it('should produce console.warn() when mixin RGB and HSL channels', () => {
        const spy = sinon.spy(console, 'warn');
        const color = new Color('#8a4');
        color.tune({ r: 50, h: -180 });
        assert(console.warn.called);
        console.warn.restore();
    });
});
