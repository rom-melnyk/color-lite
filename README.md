# color.js v0.6.0 &mdash; the color managing library.

Supports parsing and convenient handling of RGB(A) and HSL(A) color representations.

```javascript
const Color = require('color-js');
const c1 = new Color(30, 50, 70, .9);
const c2 = new Color('hsla(140, 75%, 30%, .2)');
const c3 = new Color({h: 20, s: 35, l: 90, a: 1});

document.getElementById('myDiv').style.backgroundColor = c1.toString();
document.getElementById('myDiv').style.backgroundColor = c1.clone().tune({l: -20}).toString(); // a bit lighter
c3.set({a: .5}).toString(Color.HSLA); // "hsla(20, 35%, 90%, .5)"
```
## Constructor

Use `new Color(...)` to create the **color instance.**

#### Parameters:

* either the `Object` with properties corresponding to each channel, for instance,  
   `new Color({r: 100, g: 150, b: 300})`,
* or the `String` representation:  
   `new Color("rgba(200, 30, 21, 0.5)")`.
   For your convenience, you can pass the _"rgba(...)"_ string into `Color.rgb()` constructor and vice versa; same for HSL/HSLA. In this case the missed _Alpha_ value will be set to _1_.
  * Pay attention, the CSS string must be correct. So if you pass _"rgba(...)"_, we expect _4 arguments_ in parentheses!
  * The `new Color.rgb()` constructor supports also _"#abcdef"_ and _"#abc"_ strings (case-insensitive).
  * Extra spaces in the string are ignored;
* or the _sequence of Numbers:_  
   `new Color.hsl(180, 30, 75)`.
   Mind following here:
  * _RGB_ values will be normalized to fit the range `0..255`;
  * any value of the _hue_ will be normalized to `0..359` respecting the "circle" (`-30` will be converted to `330`; `400` will be converted to `40`);
  * both _saturation_ and _lightness_ must be in the range `0..100`, not `0..1`;
  * _alpha_ channel will normalized to fit the `0..1` range.

## The color instance

Uses following params and methods:

* per-channel properties: (for instance, `.h`, `.s`, `.l` respecting the type).
* `.set()` method. It expects the `Object` (like `{h: 30, s: 50, l: 90}`) and sets the channel values in proper way.
  * Not all the channels are mandatory: `.set({h: 30, a: .3})` is fine.
* `.set.h()`, `.set.s()`, `.set.l()` and so on according to color type. All these methods expect number.
* `.tune()` and `.tune.<per-channel>()` methods. They act like setters but you pass **the delta** not the value: `c1.tune.l(-20)` decreases the _Lightness_ channel in 20 points.
  * All the **setters** and **tuners** respect channel constraints. So if you set _alpha to 2.5_ it will be actually set to _1_.
  * The **hue** channel is 360-degree-circular. So setting the _hue to -20_ makes it actually _340_ and setting it to _460_ makes it actually _100_.
  * All the **setters** and **tuners** return the reference to the same instance so they are _chainable:_ `c1.set({a: .5}).tune.h(180)`.
* `.clone()` &mdash; returns the new clone of the instance (not the reference).
* `.toString()` &mdash; overrides the standard `Object.toString()` and returns the CSS-friendly value.
  * For the `new Color.rgb()` constructor, the `.toString()` method supports one optional parameter.
   If set to `"hex"`, it makes the output look like `"#abcdef"` instead of the default `"rgb(49, 128, 200)"`.
* `.toRgb()`, `.toRgba()`, `.toHsl()`,`.toHsla()`. These converters are attached to the instance of color according to the type:
  * the instance of the RGB can be converted to the HSL and vice versa;
  * the instance of the RGBA can be converted to the HSLA and vice versa.
  * **Pay attention,** while converting _RGB &rarr; HSL &rarr; RGB'_ you might detect that channels in `RGB` and `RGB'` vary a bit. That's ok due to necessity to round floats to integers and vice versa. Such delta does not affect how the color is recognized by the human eye.
  * All the converters return the new instance of appropriate type.

## Utilities

* `Color.convert.rgb2hsl()`: expect one parameter, the object like `{r: 190, g: 89, b: 20}` and returns the object like `{h: 24, l: 41, s: 81}`.
* `Color.convert.hsl2rgb()` behaves in similar way.
  * Channel values are normalized by these methods so passing `{r: "90", b: 30}` is equivalent to `{r: 90, g: 0, b: 30}`.
* `Color.masks.rgb`, `Color.masks.rgba`, `Color.masks.hsl`, `Color.masks.hsla`, `Color.masks.rgbhex` contain regular expressions for parsing/testing the strings with color representations:
```javascript
Color.masks.rgbhex.test('#8cf'); // true
Color.masks.rgbhex.test('#82CDfa'); // true
Color.masks.rgbhex.test('#8c40'); // false
```

## Tips and tricks

1. The **HSL** model is more human-friendly as the **RGB.**
2. You can emulate human-friendly color behavior by converting the color to **HSL/HSLA** and using the `.tune()` method:
```javascript
const color = new Color.rgb('#af8c63');

// pay attention, without `.clone()` you'll change the `hsl` instance!
const darker = color.clone().tune.l(-20);
const lighter = color.clone().tune.l(20);

const saturated = color.clone().tune.s(30);
const desaturated = color.clone().tune.s(-30);

const opposite = color.clone().tune.h(180);
const harmonical_01 = color.clone().tune.h(120); // or any other hue shift
const harmonical_02 = color.clone().tune.h(-120);

const totallyDifferent = color.clone().tune({h: 30, s: 40}).set({l: 50}); // the sequence might be continued

// eventually get back to the RGB model:
document.body.style.backgroundColor = totallyDifferent.toString(); // "#d5db24"
```

## Demo

Open the `./demo/demo.html` to check the power of the library.

## Development

* we expect you to have the NodeJS. Do `npm install`;
* `npm run dev` for development;
* `npm run prod` to generate `color.min.js`;
* use `color.min.js` in browser.

## Support

The `color.min.js` could be included in your HTML. In this case `window.Color` becomes globally accessible utility object.

You can use the module with the NodeJS as well.

* `npm install --save-dev git://github.com/rom-melnyk/color.js`;
* `const Color = require('color-js')`.


## Credits

Roman Melnyk <email.rom.melnyk@gmail.com>
