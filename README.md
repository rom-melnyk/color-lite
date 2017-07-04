# color-lite v1.0.0 &mdash; the color managing library

Supports parsing and convenient handling of RGB(A) and HSL(A) color representations. Provides pretty same interface for color manipulations as LESS/SASS does.  
   Read more about [RGB](https://en.wikipedia.org/wiki/RGB_color_model) and [HSL](https://en.wikipedia.org/wiki/HSL_and_HSV).

First,
```bash
npm install --save color-lite
```

then use it as a module in your JS code:
```javascript
const Color = require('color-lite');
const c1 = new Color(30, 50, 70, .9);
const c2 = new Color('hsla(140, 75%, 30%, .2)');
const c3 = new Color({h: 20, s: 35, l: 90, a: 1});

document.querySelector('.header').style.backgroundColor = c1.toString();
document.querySelector('.footer').style.backgroundColor = c1.clone().tune({l: -20}).toString(); // a bit lighter
c3.set({a: .5}).toString(Color.HSLA); // "hsla(20, 35%, 90%, .5)"
```


## Constructor

Use `new Color(...)` to create the **color instance.**


#### Parameters:

* either the `Object` with properties corresponding to each channel, for instance,  
   `new Color({r: 100, g: 150, b: 300})`,  
   `new Color({h: 235, s: 30, l: 65, a: .85})`,
* or the `String` representation (like in CSS):  
   `new Color("rgba(200, 30, 21, 0.5)")`,  
   `new Color("hsl(70, 50%, 35%)")`,  
   `new Color("#ab84e3")`.
  * The string **must** be correct:
    - if you pass, for instance, _"rgba(...)"_, we expect _4 arguments_ in parentheses.  
    - Don't forget `%` for HSL(A) strings!
  * Both _"#abcdef"_ and _"#abc"_ representations are supported (case-insensitive).
  * Extra spaces are ignored;
* or the _sequence of Numbers:_ (considered as RGB(A))  
   `new Color(180, 30, 75)`,  
   `new Color(85, 120, 175, .5)`.

If nothing parsable is provided, `new Color()` returns the instance of **black:** `rgba(0, 0, 0, 1)`.


#### Normalization and channel defaults

Input values for channels are **normalized:**
* _RGB_ values are normalized to `0..255`;
* _Hue_ is normalized to `0..359` respecting the "wrap-around within the color circle" principle (`-30` is converted to `330`; `400` is converted to `40`);
* both _Saturation_ and _Lightness_ respect the range `0..100`, not `0..1`;
* _Alpha_ channel is normalized to `0..1`.

**Default** value for all the channels is `0` except of _Alpha_; it's `1` by default.


## The color instance

Uses following params and methods:

* per-channel properties:
  * `.r`, `.g`, `.b`,
  * `.h`, `.s`, `.l`,
  * `.a`.  
   Changing them directly affects the color. If you change RGB channels, HSL ones are updated accordingly (and vice versa). Channel [constraints](#normalization-and-channel-defaults) are respected:
```javascript
const c = new Color(120, 200, 50);
c.toString(Color.RGB); // rgb(120, 200, 50)
c.toString(Color.HSL); // hsl(92, 60%, 49%)
c.h = 200;
c.toString(Color.RGB); // rgb(50, 150, 200)
c.toString(Color.HSL); // hsl(200, 60%, 49%)
c.b = 500; // too much
c.toString(Color.RGB); // rgb(50, 150, 255)
c.toString(Color.HSL); // hsl(211, 100%, 60%)
```
* `.set(channels)` method. It expects the `Object` (like `{h: 30, s: 50, l: 90}`) and sets the channel values accordingly.
  * Not all the channels are mandatory: `.set({h: 30, a: .3})` is fine.
  * **Never** mix up RGB ans HSL channels in one object. If this happens, RGB channels are taken into consideration and HSL ones are ignored. `console.warn()` also appears.
* `.tune(channels)` method. It behaves like `.set()` but expects **the delta** not the value: `c1.tune({l: -20})` decreases the _Lightness_ channel in 20 points.
  * Channel [constraints](#normalization-and-channel-defaults) are respected as well.
  * Both `set()` and `.tune()` return the reference to the object instance so they are _chainable:_  
   `c.set({a: .5}).tune({h: 180});`
* `.clone()` returns the new clone of the Color instance (not the reference).
* `.toString(type)` returns the CSS-friendly value. `type` is one of [static constants](#static-constants): `Color.RGB`, `Color.RGBA`, `Color.HSL`, `Color.HSLA` or `Color.RGB_HEX` (this is default).
```javascript
const c = new Color(95, 5, 250);
c.toString(Color.RGBA); // rgba(95, 5, 250, 1)
c.toString(Color.HSL); // hsl(262, 96%, 50%)
c.toString(); // #5f05fa
```


## Static constants

`Color.RGB`, `Color.RGBA`, `Color.HSL`, `Color.HSLA` and `Color.RGB_HEX` stand for color type constants. These ones are used for `.toString()`


## Tips and tricks

* The **HSL** model is more human-friendly as the **RGB.**
* It speaks same language human beings do, for instance, it says _"make the color darker",_ or _"make it more blue-ish"._  
   This is done via the `.tune()` method:
```javascript
const color = new Color('#af8c63');

// pay attention, without `.clone()` you'll change the original instance!
const darker = color.clone().tune({l: -20});
const lighter = color.clone().tune({l: 20});

const saturated = color.clone().tune({s: 30});
const desaturated = color.clone().tune({s: -30});

const opposite = color.clone().tune({h: 180});
const harmonical_01 = color.clone().tune({h: 120}); // or any other hue shift
const harmonical_02 = color.clone().tune({h: -120});

const totallyDifferent = color.clone().tune({h: 30, s: 40}).set({l: 50}); // the sequence might be continued

document.body.style.backgroundColor = totallyDifferent.toString(); // "#d5db24"
```
* **Pay attention,** while converting _RGB &rarr; HSL &rarr; RGB'_, channels in `RGB` and `RGB'` might differ a bit. That's ok due to necessity to round floats to integers and vice versa. Such delta does not affect how the color is recognized by the human eye.  
   Same happens by comparing results of two different _RGB &harr; HSL_ converters.


## Demo

Open the `./demo/demo.html` to check the power of the library.


## Changes since color.js#0.6.0

This library is successor of my project **color.js** (now discontinued). So what's new:

* Constructor and entry point renamed: `$color(...)` &rarr; `Color(...)`.
* No more per-type constructors:  
   `$color.rgb(...)` &rarr; `Color(...)`;  
   `$color.hsla(...)` &rarr; `Color(...)`.
* No more per-type properties, setters and tuner: `color.set.r(..)` &rarr; `color.r = ...;`.
* No more instance converters. All the channels are present in the instance:
```javascript
// 0.6.0
const col_rgb = new $color.rgb('#dea');
const col_hsl = col_rgb.toHsl();

// 1.0.0
const col = new Color('#dea');
const { r, g, b } = col;
const { h, s, l, a } = col;
```
* Static props and methods changed.
* 100% ES6.
* No more memory leaks via clone/create!


## Development

* we expect you to have the NodeJS. Do `npm install`;
* `npm test` for unit testing;
* `npm run prod` to generate `color-lite.min.js`;
* use `color-lite.min.js` in browser.


## Support

The `color-lite.min.js` could be included in your HTML. In this case `window.Color` becomes globally accessible object. It works well with all modern browsers with ES6 support.


## Credits

Roman Melnyk <email.rom.melnyk@gmail.com>
