const assert = require('assert');

const Color = require('../src/color');

describe('Color', () => {
    'use strict';

    it('should create Color instance from sequence of numbers', () => {
        const color = new Color(0xaa, 0x88, 0x33);
        assert(color.r);
        assert(color.g);
        assert(color.b);
        assert.equal(color.a, 1);
        assert(color.h);
        assert(color.s);
        assert(color.l);
    });

});

