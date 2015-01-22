# color.js - the color managing library.
Supports parsing and convenient handling of RGB(A) and HSL(A) color representations.

```javascript
var c1 = new $color.hsla(30, 50, 70, .9);
var c2 = new $color.hsla('hsla(140, 75%, 30%, .2)');
var c3 = new $color.hsla(20, 35, 90, 1);

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
  * Pay attention, the string must be correct so if you pass _"rgba()"_, we expect 4 arguments in parentheses!
  * Extra spaces in the string are ignored;
* or the *sequence of numbers:* `new $color.hsl(180, 30, 75)`.

## The color instance
Contains following params:
* `.type` -- means one of "rgb", "rgba", "hsl", "hsla".
* per-channel properties (for instance, `.h`, `.s`, `.l` respecting the type).
* `.set()` method. It expects the object (like `{h: 30, s: 50, l: 90}`) and sets the channel values in proper way.
* `.set.h()`, `.set.s()`, `.set.l()` and so on according to color type. All these methods expect number.
* `.tune()` and `.tune.<per-channel>()` methods. They act like setters but you pass the delta not the value: `c1.tune.l(-20)` decreases the _Lightness_ channel in 20 point.
  * All the _setters_ and _tuners_ respect the channel constrains. For instance, if you try to set _alpha > 1_ it will be set to _1_.
* `.clone()` -- returns the clone of the instance (not the reference).
* `.toString()` -- overrides the standard `Object.toString()` and returns the CSS-friendly value.

## Planned for further releases:
* make the `rgb.toString()` able to produce `#abcdef`-like output;
* RGB-HSL-RGB converter

## Credits
Roman Melnyk <email.rom.melnyk@gmail.com>
