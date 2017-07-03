'use strict';

const assert = require('assert');
const Color = require('../src/color-lite');


describe('Color .toString()', () => {
    const color = new Color(0xaa, 0x88, 0x33, .45);

    it('should generate proper string representation via .toString(RGB)', () => {
        const string = color.toString(Color.RGB);
        assert.equal(string, 'rgb(170, 136, 51)');
    });

    it('should generate proper string representation via .toString(RGBA)', () => {
        const string = color.toString(Color.RGBA);
        assert.equal(string, 'rgba(170, 136, 51, 0.45)');
    });

    it('should generate proper string representation via .toString(RGB_HEX)', () => {
        const string = color.toString();
        assert.equal(string, '#aa8833');
    });

    it('should generate proper string representation via .toString(HSL)', () => {
        const string = color.toString(Color.HSL);
        assert.equal(string, 'hsl(43, 54%, 43%)');
    });

    it('should generate proper string representation via .toString(HSLA)', () => {
        const string = color.toString(Color.HSLA);
        assert.equal(string, 'hsla(43, 54%, 43%, 0.45)');
    });
});

