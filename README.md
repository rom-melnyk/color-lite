# color.js - the color managing library.
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
  * Pay attention, the string must be correct so if you pass _"rgba()"_, we expect _4 arguments_ in parentheses!
  * Extra spaces in the string are ignored;
* or the *sequence of numbers:* `new $color.hsl(180, 30, 75)`.

## The color instance
Contains following params:
* `.type` -- means one of "rgb", "rgba", "hsl", "hsla".
* per-channel properties (for instance, `.h`, `.s`, `.l` respecting the type).
* `.set()` method. It expects the object (like `{h: 30, s: 50, l: 90}`) and sets the channel values in proper way.
  * You can pass only several channels into this methods not always all ones: `.set({h: 30, a: .3})` is fine.
* `.set.h()`, `.set.s()`, `.set.l()` and so on according to color type. All these methods expect number.
* `.tune()` and `.tune.<per-channel>()` methods. They act like setters but you pass **the delta** not the value: `c1.tune.l(-20)` decreases the _Lightness_ channel in 20 point.
  * All the **setters** and **tuners** respect channel constraints. So if you set _alpha to 2.5_ it will be actually set to _1_.
  * The **hue** channel is 360-degree-circular. So setting the _hue to -20_ makes it actually _340_ and setting it to _460_ makes it actually _100_.
* `.clone()` -- returns the new clone of the instance (not the reference).
* `.toString()` -- overrides the standard `Object.toString()` and returns the CSS-friendly value.

## Planned for further releases
* make the `rgb.toString()` able to produce `#abcdef`-like output;
* RGB-HSL-RGB converter

## Support
IE8 is not supported at this moment (due to usage of `.forEach()` and `.infexOf()`). All the other modern browsers support this library well.

## Credits
Roman Melnyk <email.rom.melnyk@gmail.com>
