'use strict';

let colorModels;
let colorModel;
let color;

// HTML elements
let colorModelRadios;
let colorStringLabel;

let isGrayCheckbox;
let showChannelHintsCheckbox;

let channelLabels;
let channelInputs;


function init() {
    colorModels = {
        rgb: [
            {label: 'Red',          min: 0,     max: 255,   step: 5,    channel: 'r'},
            {label: 'Green',        min: 0,     max: 255,   step: 5,    channel: 'g'},
            {label: 'Blue',         min: 0,     max: 255,   step: 5,    channel: 'b'}
        ],
        hsl: [
            {label: 'Hue',          min: 0,     max: 360,   step: 10,   channel: 'h'},
            {label: 'Saturation',   min: 0,     max: 100,   step: 5,    channel: 's'},
            {label: 'Lightness',    min: 0,     max: 100,   step: 5,    channel: 'l'}
        ]
    };

    colorModelRadios = [...document.querySelectorAll('input[name=color-model]')];
    colorStringLabel = document.querySelector('.model-selector span');

    isGrayCheckbox = document.querySelector('#gray');
    showChannelHintsCheckbox = document.querySelector('#show-channel-hints');

    channelLabels = [...document.querySelectorAll('.sliders label')];
    channelInputs = [...document.querySelectorAll('.sliders input')];

    colorModel = colorModelRadios.find(input => input.checked).value;
    color = new Color(
        // [0..255] with step 5
        Math.round(Math.random() * 51) * 5,
        Math.round(Math.random() * 51) * 5,
        Math.round(Math.random() * 51) * 5
    );
}


function updateSliders() {
    colorModels[colorModel].forEach((props, i) => {
        channelLabels[i].innerHTML = props.label;
        channelInputs[i].setAttribute('min', props.min);
        channelInputs[i].setAttribute('max', props.max);
        channelInputs[i].setAttribute('step', props.step);
        channelInputs[i].setAttribute('channel', props.channel);
        channelInputs[i].value = color[props.channel];
    });
}


function updateColor(props = {}) {
    color.set(props);

    const hexColor = color.toString();
    document.body.style.backgroundColor = hexColor;

    colorStringLabel.innerHTML = color.toString(colorModel === 'rgb' ? Color.RGB : Color.HSL)
        + (colorModel === 'rgb' ? ', ' + hexColor : '');
}


function getGradientValues(channel) {
    if (!isGrayCheckbox.disabled && isGrayCheckbox.checked) {
        return ['#000', '#fff'];
    }

    let values;
    const clone = color.clone();

    if (channel === 'h') {
        // provide all the rainbow here otherwise there will be no gradient (red-to-red)
        values = [0, 60, 120, 180, 240, 300, 360];
    } else if (channel === 's') {
        values = [0, 100];
    } else if (channel === 'l') {
        // need proper color in the middle otherwise there will be gradient black-to-white
        values = [0, 50 ,100];
    } else {
        values = [0, 255];  // RGB channels
    }

    values = values.map(function (v) {
        return clone.set({ [channel]: v }).toString();
    });

    return values;
}


function updateSliderGradients(force) {
    if (!showChannelHintsCheckbox.checked && !force) {
        return;
    }

    channelInputs.forEach(function (input) {
        if (showChannelHintsCheckbox.checked) {
            const gradientValues = getGradientValues( input.getAttribute('channel')).join(', ');
            input.parentElement.style.background = `linear-gradient(to right, ${gradientValues})`;
            input.parentElement.style.backgroundRepeat = 'no-repeat';
            input.parentElement.style.backgroundPosition = '90% 0';
            input.parentElement.style.backgroundSize = '80% 100%';
        } else {
            input.parentElement.style.background = 'none';
        }
    });
}


function setSlidersToGrey(value) {
    channelInputs.forEach(function (inp) {
        inp.value = value;
    });
}


function onLoad() {
    init();

    updateSliders();
    updateColor();
    updateSliderGradients();


    // --- (*) RGB    ( ) HSL ---
    colorModelRadios.forEach(function (input) {
        input.addEventListener('change', (e) => {
            colorModel = colorModel === 'rgb' ? 'hsl' : 'rgb';
            updateSliders();
            isGrayCheckbox.disabled = colorModel === 'hsl';
            if (colorModel === 'hsl') {
                isGrayCheckbox.checked = false;
            }
            updateColor();
            updateSliderGradients();
        }, false);
    });


    // --- [x] grey ---
    isGrayCheckbox.addEventListener('change', () => {
        if (isGrayCheckbox.checked) {
            const grey = Math.round((color.r + color.g + color.b) / 3);
            setSlidersToGrey(grey);
            updateColor({r: grey, g: grey, b: grey});
        } else {
            updateColor();
        }
        updateSliderGradients();
    }, false);


    // --- [x] show channel hints ---
    showChannelHintsCheckbox.addEventListener('change', () => {
        updateSliderGradients(true);
    }, false);


    // Channel [ ---------||--- ]
    channelInputs.forEach((input) => {
        input.addEventListener('change', (e) => {
            const value = +input.value;
            if (!isGrayCheckbox.disabled && isGrayCheckbox.checked) {
                setSlidersToGrey(value);
                updateColor({r: value, g: value, b: value});
            } else {
                const channel = input.getAttribute('channel');
                updateColor({ [channel]: value });
            }
            updateSliderGradients();
        }, false);
    });
}
