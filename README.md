# color.js - the color managing library.
Currently parses HSLA only. RGB(a) will be release in further versions.

```
var c1 = new $color.hsla(30, 50, 70, .9);
var c2 = new $color.hsla('hsla(140, 75%, 30%, .2)');

document.getElementById('myDiv').style.backgroundColor = c1.toString();
document.getElementById('myDiv').style.backgroundColor = c1.clone().tune({l: -20}).toString(); // a bit lighter
```

TODO: complete documentation.

See code annotation for methods usage help:
* `new $color.hsla()`
* `color.tune()`
* `color.set()`
* `color.clone()`
* `color.toString()`
