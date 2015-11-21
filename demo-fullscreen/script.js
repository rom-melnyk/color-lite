function QS (selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
}

function QS1 (selector) {
    return document.querySelector(selector);
}

var colorModels,
    channelLabels, channelInputs, colorStringLabel,
    isGrayCheckbox, showChannelHintsCheckbox,
    color;

function prepareControls () {
    colorModels = {
        rgb: [
            {label: 'Red', min: 0, max: 255, step: 5, channel: 'r'},
            {label: 'Green', min: 0, max: 255, step: 5, channel: 'g'},
            {label: 'Blue', min: 0, max: 255, step: 5, channel: 'b'}
        ],
        hsl: [
            {label: 'Hue', min: 0, max: 360, step: 10, channel: 'h'},
            {label: 'Saturation', min: 0, max: 100, step: 5, channel: 's'},
            {label: 'Lightness', min: 0, max: 100, step: 5, channel: 'l'}
        ]
    };

    channelLabels = QS('.sliders label');
    channelInputs = QS('.sliders input');
    colorStringLabel = QS1('.scheme-selector span');
    isGrayCheckbox = QS1('#gray');
    showChannelHintsCheckbox = QS1('#show-channel-hints');
}

function updateSliders (model) {
    var i = 0;
    colorModels[model].forEach(function (props) {
        channelLabels[i].innerHTML = props.label;
        channelInputs[i].setAttribute('min', props.min);
        channelInputs[i].setAttribute('max', props.max);
        channelInputs[i].setAttribute('step', props.step);
        channelInputs[i].setAttribute('channel', props.channel);
        channelInputs[i].value = color[props.channel];
        i++;
    });
}

function updateColor (props) {
    color.set(props);

    var bgColor = color.type === 'rgb'
        ? color.toString('hex')
        : color.toRgb().toString('hex');
    document.body.style.backgroundColor = bgColor;

    colorStringLabel.innerHTML = color.toString() + (color.type === 'rgb' ? ', ' + bgColor : '');
}

function getChannelProps (input) {
    var props = {};
    props[ input.getAttribute('channel') ] = +input.value;
    return props;
}

function getGradientValues (channel) {
    var values = [];
    var clone, props;

    if (!isGrayCheckbox.disabled && isGrayCheckbox.checked) {
        values.push('#000', '#fff');
        return values;
    }

    clone = color.clone();
    props = {};

    if (channel === 'h') {
        values = [0, 60, 120, 180, 240, 300, 360];
    } else {
        values = [0, 999];  // 999 is more than possible for any channel; will be truncated automatically
    }

    values = values.map(function (v) {
        props[channel] = v;
        return clone.set(props).toString();
    });

    return values;
}

function updateSliderGradients (force) {
    if (!showChannelHintsCheckbox.checked && !force) {
        return;
    }

    channelInputs.forEach(function (input) {
        var gradientValues;

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

function setSlidersToGrey (value) {
    channelInputs.forEach(function (inp) {
        inp.value = value;
    });
}

function onLoad () {
    prepareControls();
    color = new $color.rgb(255, 255, 255);

    updateSliders(color.type);
    updateColor({});
    updateSliderGradients();

    // --- (*) RGB    ( ) HSL ---
    QS('input[name=color-scheme]').forEach(function (input) {
        input.addEventListener('change', function (e) {
            color = color.type === 'rgb' ? color.toHsl() : color.toRgb();
            updateSliders(color.type);
            isGrayCheckbox.disabled = color.type === 'hsl';
            if (color.type === 'hsl') {
                isGrayCheckbox.checked = false;
            }
            updateColor({});
            updateSliderGradients();
        }, false);
    });

    // --- [x] grey ---
    isGrayCheckbox.addEventListener('change', function () {
        var grey;
        if (isGrayCheckbox.checked) {
            grey = Math.round((color.r + color.g + color.b) / 3);
            setSlidersToGrey(grey);
            updateColor({r: grey, g: grey, b: grey});
        } else {
            updateColor({});
        }
        updateSliderGradients();
    }, false);

    // --- [x] show color hints ---
    showChannelHintsCheckbox.addEventListener('change', function () {
        updateSliderGradients(true);
    }, false);

    // Channel [ ---------||--- ]
    channelInputs.forEach(function (input) {
        input.addEventListener('change', function (e) {
            var grey;
            if (!isGrayCheckbox.disabled && isGrayCheckbox.checked) {
                grey = +input.value;
                setSlidersToGrey(grey);
                updateColor({r: grey, g: grey, b: grey});
            } else {
                updateColor( getChannelProps(input) );
            }
            updateSliderGradients();
        }, false);
    });
}
