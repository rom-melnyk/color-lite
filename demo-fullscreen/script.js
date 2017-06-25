let colorModels,
    colorModelRadio, colorStringLabel,
    isGrayCheckbox, showChannelHintsCheckbox,
    channelLabels, channelInputs,
    color;


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

    colorModelRadio = [...document.querySelectorAll('input[name=color-model]')];
    colorStringLabel = document.querySelector('.model-selector span');

    isGrayCheckbox = document.querySelector('#gray');
    showChannelHintsCheckbox = document.querySelector('#show-channel-hints');

    channelLabels = [...document.querySelectorAll('.sliders label')];
    channelInputs = [...document.querySelectorAll('.sliders input')];
}


function updateSliders(model) {
    colorModels[model].forEach((props, i) => {
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

    let bgColor = color.type === 'rgb'
        ? color.toString('hex')
        : color.toRgb().toString('hex');
    document.body.style.backgroundColor = bgColor;

    colorStringLabel.innerHTML = color.toString() + (color.type === 'rgb' ? ', ' + bgColor : '');
}


function getGradientValues(channel) {
    if (!isGrayCheckbox.disabled && isGrayCheckbox.checked) {
        return ['#000', '#fff'];
    }

    let values;
    const clone = color.clone();

    if (channel === 'h') {
        values = [0, 60, 120, 180, 240, 300, 360];
    } else if (channel === 'l') {
        values = [0, 50 ,100];
    } else {
        values = [0, 999];  // 999 is more than possible for any channel; will be truncated automatically
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
        let gradientValues;

        if (showChannelHintsCheckbox.checked) {
            gradientValues = getGradientValues( input.getAttribute('channel')).join(', ');
            input.parentElement.style.background = 'linear-gradient(to right, ' + gradientValues + ')';
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
    color = new $color.rgb(
        Math.round(Math.random() * 255),
        Math.round(Math.random() * 255),
        Math.round(Math.random() * 255)
    );

    updateSliders(color.type);
    updateColor();
    updateSliderGradients();


    // --- (*) RGB    ( ) HSL ---
    colorModelRadio.forEach(function (input) {
        input.addEventListener('change', (e) => {
            color = color.type === 'rgb' ? color.toHsl() : color.toRgb();
            updateSliders(color.type);
            isGrayCheckbox.disabled = color.type === 'hsl';
            if (color.type === 'hsl') {
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
