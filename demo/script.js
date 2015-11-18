function _toArray (iterable) {
	return Array.prototype.slice.call(iterable);
}

var colors = {
	c1: new $color.hsla(30, 40, 50),
	c2: new $color.hsla(230, 70, 30, .3),
	c3: new $color.hsla(180, 90, 60, .8),
	c4: new $color.rgb('#3f55a8'),
	c5: new $color.rgba('rgba(80, 160, 122, .7)'),
	c6: new $color.rgba('rgb(180, 60, 30)')
};

var selected = {};

/**
 * This is the event handler
 * @this {HTMLElement} <input type="radio">
 */
function manageRadioSelector () {
	var colKey;
	selected.p = this.parentElement;
	selected.span = this.parentElement && this.parentElement.getElementsByTagName('span')[0];
	colKey = selected.p.id;

	if (['c1', 'c2', 'c3'].indexOf(colKey) !== -1) {
		document.getElementById('hue').value = colors[ colKey ].h;
		document.getElementById('saturation').value = colors[ colKey ].s;
		document.getElementById('lightness').value = colors[ colKey ].l;
		document.getElementById('hsl-alpha').value = colors[ colKey ].a;
		['red', 'green', 'blue', 'rgb-alpha'].forEach(function (id) {
			document.getElementById(id).disabled = true;
		});
		['hue', 'saturation', 'lightness', 'hsl-alpha'].forEach(function (id) {
			document.getElementById(id).disabled = false;
		});
	} else { // ['c4', 'c5', 'c6']
		document.getElementById('red').value = colors[ colKey ].r;
		document.getElementById('green').value = colors[ colKey ].g;
		document.getElementById('blue').value = colors[ colKey ].b;
		document.getElementById('rgb-alpha').value = colors[ colKey ].a;
		['hue', 'saturation', 'lightness', 'hsl-alpha'].forEach(function (id) {
			document.getElementById(id).disabled = true;
		});
		['red', 'green', 'blue', 'rgb-alpha'].forEach(function (id) {
			document.getElementById(id).disabled = false;
		});
	}
}

/**
 * This is the event handler
 * @this {HTMLElement} <input type="range">
 */
function manageColorComponent () {
	var val = +this.value;
	var color;

	if (!selected.span || !selected.p) {
		return;
	}

	color = colors[ selected.p.id ];

	switch (this.id) {
		case "hue":
			color.set({ h: val });
			break;
		case "saturation":
			color.set({ s: val });
			break;
		case "lightness":
			color.set({ l: val });
			break;
		case "hsl-alpha":
			if (color.type === 'hsla') {
				color.set({ a: val });
			}
			break;
		case "red":
			color.set({ r: val });
			break;
		case "green":
			color.set({ g: val });
			break;
		case "blue":
			color.set({ b: val });
			break;
		case "rgb-alpha":
			if (color.type === 'rgba') {
				color.set({ a: val });
			}
			break;
	}
	selected.p.style.backgroundColor = color.toString();
	selected.span.innerHTML = color.toString();
	if (color.type === 'rgb') {
		selected.span.innerHTML += ', ' + color.toString('hex');
	}
}

// initial background-color setting
for (var key in colors) {
	if (colors.hasOwnProperty(key)) {
		document.querySelector('#' + key).style.backgroundColor = colors[key].toString();
		document.querySelector('#' + key + ' span').innerHTML = colors[key].toString();
		// document.getElementById(key)
		// document.getElementById(key).getElementsByTagName('span')[0].innerHTML = colors[key].toString();
		if (colors[key].type === 'rgb') {
			document.querySelector('#' + key + ' span').innerHTML += ', ' + colors[key].toString('hex');
		}
	}
}

// initial slider setting
manageRadioSelector.call(document.querySelector('[name=color][checked=true]'));

_toArray(document.querySelectorAll('[name=color]')).forEach(function (input) {
	input.onchange = manageRadioSelector;
});
_toArray(document.querySelectorAll('[type=range]')).forEach(function (input) {
	input.onchange = manageColorComponent;
});

_toArray(document.querySelectorAll('.container h4')).forEach(function (header) {
	header.addEventListener('click', function () {
		this.parentElement.className =
			this.parentElement.className === 'container collapsed'
			? 'container'
			: 'container collapsed';
	}, true);
});

// --- RGB / HSL conversion ---
function _rnd (from, to) {
	if (to === undefined) {
		to = from;
		from = 0;
	}
	return Math.floor(Math.random() * (to - from) + from);
};

var __c1 = new $color.hsla(_rnd(360), _rnd(100), _rnd(100), Math.random() * .7 + .3);
var __c2 = __c1.toRgba();
var __c3 = __c2.toHsla();
document.getElementById('rgb01').innerHTML = __c1.toString();
document.getElementById('rgb01').style.backgroundColor = __c1.toString();
document.getElementById('hsl01').innerHTML = __c2.toString();
document.getElementById('hsl01').style.backgroundColor = __c2.toString();
document.getElementById('rgb02').innerHTML = __c3.toString();
document.getElementById('rgb02').style.backgroundColor = __c3.toString();
