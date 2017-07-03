'use strict';

const assert = require('assert');
const Color = require('../src/color-lite');
const { parse } = require('../src/parse');


function rnd(max) {
    return Math.round(Math.random() * max);
}


describe('parse', () => {
    it('should parse invalid string as black', () => {
        const parsed_1 = parse('asdfasdfasdf');
        assert.deepEqual(parsed_1, { r: 0, g: 0, b: 0 });
        const parsed_2 = parse('#aa99zz');
        assert.deepEqual(parsed_2, { r: 0, g: 0, b: 0 });
    });

    it('should parse the rgb(...) string', () => {
        const [ r, g, b ] = [ rnd(255), rnd(255), rnd(255) ];
        const parsed = parse(`  rgb(${r},${g} ,   ${b} )`);
        assert.deepEqual(parsed, { r, g, b });
    });

    it('should parse the rgba(...) string', () => {
        // alpha is float so it does not make sense to set it too precise
        const [ r, g, b, a ] = [ rnd(255), rnd(255), rnd(255), .33 ];
        const parsed = parse(`  rgba(${r},${g} ,   ${b}, ${a} )`);
        assert.deepEqual(parsed, { r, g, b, a });
    });

    it('should parse the #... string', () => {
        const parsed_1 = parse(`  #abe`);
        assert.deepEqual(parsed_1, { r: 0xaa, g: 0xbb, b: 0xee });
        const parsed_2 = parse(`  #8c24f3`);
        assert.deepEqual(parsed_2, { r: 0x8c, g: 0x24, b: 0xf3 });
    });

    it('should parse the hsl(...) string', () => {
        const [ h, s, l ] = [ rnd(360), rnd(100), rnd(100) ];
        const parsed = parse(`  hsl( ${h},  ${s} % ,${l}% )`);
        assert.deepEqual(parsed, { h, s, l });
    });

    it('should parse the hsla(...) string', () => {
        // alpha is float so it does not make sense to set it too precise
        const [ h, s, l, a ] = [ rnd(360), rnd(100), rnd(100), .56 ];
        const parsed = parse(`  hsla( ${h},  ${s} % ,${l}% , ${a} )`);
        assert.deepEqual(parsed, { h, s, l, a });
    });

});

