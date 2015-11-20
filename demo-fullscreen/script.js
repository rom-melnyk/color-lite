function QS (selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
}

function QS1 (selector) {
    return document.querySelector(selector);
}

var colorModels,
    channelLabels, channelInputs, colorStringLabel,
    color;

function prepareControls () {
    colorModels = {
        rgb: [
            {label: 'Red', min: 0, max: 255, step: 5, channel: 'r'},
            {label: 'Green', min: 0, max: 255, step: 5, channel: 'g'},
            {label: 'Blue', min: 0, max: 255, step: 5, channel: 'b'},
        ],
        hsl: [
            {label: 'Hue', min: 0, max: 360, step: 10, channel: 'h'},
            {label: 'Saturation', min: 0, max: 100, step: 5, channel: 's'},
            {label: 'Lightness', min: 0, max: 100, step: 5, channel: 'l'},
        ]
    };

    channelLabels = QS('.sliders label');
    channelInputs = QS('.sliders input');
    colorStringLabel = QS1('.scheme-selector span');
}

function updateControlsArea (model) {
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

function updateGradients () {
    channelInputs.forEach(function (input) {
        var clone = color.clone();
        var props = {};
        var c1, c2;

        props[ input.getAttribute('channel') ] = 0;
        c1 = clone.set(props).toString();
        props[ input.getAttribute('channel') ] = 999; // more than possible; will be truncated automatically
        c2 = clone.set(props).toString();

        input.parentElement.style.background = 'linear-gradient(to right, ' + c1 + ', ' + c2 + ')';
        input.parentElement.style.backgroundRepeat = 'no-repeat';
        input.parentElement.style.backgroundPosition = '90% 0';
        input.parentElement.style.backgroundSize = '80% 100%';
    });
}

function onLoad () {
    prepareControls();
    color = new $color.rgb(255, 255, 255);

    updateControlsArea(color.type);
    updateColor({});
    updateGradients();

    QS('input[name=color-scheme]').forEach(function (input) {
        input.addEventListener('change', function (e) {
            color = color.type === 'rgb' ? color.toHsl() : color.toRgb();
            updateControlsArea(color.type);
            updateColor({});
        }, false);
    });

    channelInputs.forEach(function (input) {
        input.addEventListener('change', function (e) {
            updateColor( getChannelProps(input) );
            updateGradients();
        }, false);
    });
}
