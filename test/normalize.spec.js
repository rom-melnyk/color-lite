'use strict';

const assert = require('assert');

const normalize = require('../src/normalize');

describe('normalize', () => {
    ['red', 'green', 'blue'].forEach((channel) => {
        const method = channel.substr(0, 1);
        describe(channel, () => {
            it('should return 0 if NaN or <0', () => {
                assert.equal(normalize[method](-5), 0);
                assert.equal(normalize[method]('not-a-number'), 0);
            });

            it('should return 255 if >255', () => {
                assert.equal(normalize[method](300), 255);
            });

            it('should return save value if [0..255]', () => {
                [0, 100, 255].forEach((v) => {
                    assert.equal(normalize[method](v), v);
                });
            });
        });
    });


    describe('hue', () => {
        it('should return (360 - x) if (x < 0)', () => {
            [-10, -100, -200].forEach((v) => {
                assert.equal(normalize.h(v), 360 + v);
            });

            [-10, -100, -200].forEach((v) => {
                assert.equal(normalize.h(v - 360 * 5), 360 + v);
            });
        });

        it('should return x if (360 + x)', () => {
            [10, 100, 200].forEach((v) => {
                assert.equal(normalize.h(360 + v), v);
            });

            [10, 100, 200].forEach((v) => {
                assert.equal(normalize.h(360 * 5 + v), v);
            });
        });

        it('should return 0 for NaN', () => {
            assert.equal(normalize.h('not-a-number'), 0);
        });

        it('should return 0 for 0', () => {
            assert.equal(normalize.h(0), 0);
        });

        it('should return 0 for 360', () => {
            assert.equal(normalize.h(360), 0);
        });
    });


    ['saturation', 'lightness'].forEach((channel) => {
        const method = channel.substr(0, 1);
        describe(channel, () => {
            it('should return 0 if NaN or <0', () => {
                assert.equal(normalize[method](-5), 0);
                assert.equal(normalize[method]('not-a-number'), 0);
            });

            it('should return 100 if >100', () => {
                assert.equal(normalize[method](300), 100);
            });

            it('should return save value if [0..100]', () => {
                [0, 50, 100].forEach((v) => {
                    assert.equal(normalize[method](v), v);
                });
            });

        });
    });
});

