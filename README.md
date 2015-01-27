# color.js v0.5.9 &mdash; the color managing library.
Supports parsing and convenient handling of RGB(A) and HSL(A) color representations.

```javascript
var c1 = new $color.hsla(30, 50, 70, .9);
var c2 = new $color.hsla('hsla(140, 75%, 30%, .2)');
var c3 = new $color.hsla({h: 20, s: 35, l: 90, a: 1});

document.getElementById('myDiv').style.backgroundColor = c1.toString();
document.getElementById('myDiv').style.backgroundColor = c1.clone().tune({l: -20}).toString(); // a bit lighter
c3.set.a(.5).toString(); // "hsla(20, 35%, 90%, .5)"
```
## Constructor
Use `new $color.rgb(...)`, `new $color.rgba(...)`, `new $color.hsl(...)`, `new $color.hsla(...)` to create the color instance.
#### Parameters:
* either the *object* with properties corresponding to each channel: `new $color({r: 100, g: 150, b: 300})`
* or the *string* representation: `new $color.rgba("rgba(200, 30, 21, 0.5)")`  
for your convenience, you can pass the _"rgba(...)"_ string into `$color.rgb()` constructor and vice versa; same for HSL/HSLA. In this case the missed _Alpha_ value will be set to _1_.
  * Pay attention, the string must be correct so if you pass _"rgba(...)"_, we expect _4 arguments_ in parentheses!
  * The particular `new $color.rgb()` constructor supports also _"#abcdef"_ and _"#abc"_ strings (case-insensitive).
  * Extra spaces in the string are ignored;
* or the *sequence of numbers:* `new $color.hsl(180, 30, 75)`.

## The color instance
Contains following params:
* `.type` &mdash; means one of "rgb", "rgba", "hsl", "hsla".
* per-channel properties (for instance, `.h`, `.s`, `.l` respecting the type).
* `.set()` method. It expects the object (like `{h: 30, s: 50, l: 90}`) and sets the channel values in proper way.
  * You can pass only several channels into this methods not always all ones: `.set({h: 30, a: .3})` is fine.
* `.set.h()`, `.set.s()`, `.set.l()` and so on according to color type. All these methods expect number.
* `.tune()` and `.tune.<per-channel>()` methods. They act like setters but you pass **the delta** not the value: `c1.tune.l(-20)` decreases the _Lightness_ channel in 20 points.
  * All the **setters** and **tuners** respect channel constraints. So if you set _alpha to 2.5_ it will be actually set to _1_.
  * The **hue** channel is 360-degree-circular. So setting the _hue to -20_ makes it actually _340_ and setting it to _460_ makes it actually _100_.
  * All the **setters** and **tuners** return the reference to the same instance so they are _chainable:_ `c1.set({a: .5}).tune.h(180)`.
* `.clone()` &mdash; returns the new clone of the instance (not the reference).
* `.toString()` &mdash; overrides the standard `Object.toString()` and returns the CSS-friendly value.
  * For the `new $color.rgb()` constructor, the `.toString()` method supports one optional parameter.  
   If set to `"hex"`, it makes the output look like `"#abcdef"` instead of the default `"rgb(49, 128, 200)"`.
* `.toRgb()`, `.toRgba()`, `.toHsl()`,`.toHsla()`. These converters are attached to the instance of color according to the type:
  * the instance of the RGB can be converted to the HSL and vice versa;
  * the instance of the RGBA can be converted to the HSLA and vice versa.
  * **Pay attention,** while converting _RGB &rarr; HSL &rarr; RGB'_ you can detect that channels in `RGB` and `RGB'` vary a bit. That's ok due to necessity to round floats to integers and vice versa. Such delta does not affect how the color is recognized by the human eye.
  * All the converters return the new instance of appropriate type.

## Tips and tricks
1. The **HSL** model is more human-friendly as the **RGB.**
2. You can emulate human-friendly color behavior by converting the color to **HSL/HSLA** and using the `.tune()` method:
```javascript
var _original = new $color.rgb('#af8c63');
var hsl = _original.toHsl();

// pay attention, without `.clone()` you'll change the `hsl` instance!
var _darker = hsl.clone().tune.l(-20);
var _lighter = hsl.clone().tune.l(20);

var _saturated = hsl.clone().tune.s(30);
var _desaturated = hsl.clone().tune.s(-30);

var _opposite = hsl.clone().tune.h(180);
var _harmonical_01 = hsl.clone().tune.h(120); // or any other hue shift
var _harmonical_02 = hsl.clone().tune.h(-120);

var _totally_different = hsl.clone().tune({h: 30, s: 40}).set({l: 50}); // the sequence might continued

# eventually get back to the RGB model:
document.body.style.backgroundColor = _totally_different.toRgb().toString('hex'); // "#d5db24"
```

## Demo
Open the `./test/test.html` to check the power of the library.

## Planned for further releases
* single constructor

## Support
IE8 is not supported at this moment (due to usage of `.forEach()` and `.infexOf()`). All the other modern browsers support this library well.

## Credits
Roman Melnyk <email.rom.melnyk@gmail.com>
