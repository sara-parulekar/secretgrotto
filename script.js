// depth indicator for the header
function updateDepth() {
    const depth = Math.round((window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 6000);
    const depthValue = document.getElementById('depth-value');
    if (depthValue) depthValue.textContent = depth + 'M';
}
window.addEventListener('scroll', updateDepth);
window.addEventListener('load', updateDepth);

// button functionality
function closeAll(type) {
    document.querySelectorAll(type).forEach(el => el.classList.remove('active'));
}

document.querySelectorAll('.font-name-btn').forEach(button => {
    button.addEventListener('click', () => {
        const font = button.getAttribute('data-font');
        closeAll('.font-description');
        closeAll('.credits-info');
        document.getElementById(`description-${font}`)?.classList.toggle('active');
    });
});

document.querySelectorAll('.credits-btn').forEach(button => {
    button.addEventListener('click', () => {
        const section = button.getAttribute('data-section');
        closeAll('.credits-info');
        closeAll('.font-description');
        document.getElementById(`credits-${section}`)?.classList.toggle('active');
    });
});

// button for downloading (source linked in README)
const fontFiles = {
    'font1': 'assets/fonts/font1_novice witch/novicewitch.ttf',
    'font2': 'assets/fonts/font2_changetheweb/ChangetheWebVF.ttf',
    'font3': 'assets/fonts/font3_losttimes/losttimesVF.ttf'
};

document.querySelectorAll('.download-btn').forEach(button => {
    button.addEventListener('click', () => {
        const fontName = button.getAttribute('data-font');
        const fontPath = fontFiles[fontName];
        if (fontPath) {
            const link = document.createElement('a');
            link.href = fontPath;
            link.download = `${fontName}.ttf`;
            link.click();
        }
    });
});

// code for variable fonts (source linked in README)
const fontConfigs = {
    'font1': { axis: 'POSI', defaultWght: 700, sliderId: 'position-slider', valueId: 'position-value', sizeSliderId: 'size-slider-1', sizeValueId: 'size-value-1', initialValue: 0 },
    'font2': { axis: 'STCH', defaultWght: 700, sliderId: 'stretch-slider', valueId: 'stretch-value', sizeSliderId: 'size-slider', sizeValueId: 'size-value', initialValue: 100 },
    'font3': { axis: 'MOVE', defaultWght: 500, sliderId: 'move-slider', valueId: 'move-value', sizeSliderId: 'size-slider-3', sizeValueId: 'size-value-3', initialValue: 0 }
};

function animateAxis(title, config) {
    let currentValue = config.initialValue;
    let direction = config.initialValue === 0 ? 1 : -1;
    let animationId = null;
    let isAnimating = true;

    const slider = document.getElementById(config.sliderId);
    const valueDisplay = document.getElementById(config.valueId);
    let currentSize = 6.5;

    function updateFont(value) {
        title.style.setProperty('font-variation-settings', `'wght' ${config.defaultWght}, '${config.axis}' ${value}`, 'important');
        if (slider) slider.value = value;
        if (valueDisplay) valueDisplay.textContent = Math.round(value);
    }

    function animate() {
        if (!isAnimating) return;
        currentValue += direction;
        if (currentValue >= 100) {
            currentValue = 100;
            direction = -1;
        } else if (currentValue <= 0) {
            currentValue = 0;
            direction = 1;
        }
        updateFont(currentValue);
        animationId = requestAnimationFrame(animate);
    }

    updateFont(config.initialValue);
    animate();

    if (slider) {
        slider.addEventListener('mousedown', () => {
            isAnimating = false;
            if (animationId) cancelAnimationFrame(animationId);
        });
        slider.addEventListener('input', (e) => {
            currentValue = parseInt(e.target.value);
            updateFont(currentValue);
        });
        slider.addEventListener('mouseup', () => {
            isAnimating = true;
            animate();
        });
    }

    // linked in readme
    const sizeSlider = document.getElementById(config.sizeSliderId);
    const sizeValue = document.getElementById(config.sizeValueId);
    if (sizeSlider) {
        sizeSlider.addEventListener('input', (e) => {
            currentSize = parseFloat(e.target.value);
            title.style.fontSize = currentSize + 'rem';
            if (sizeValue) sizeValue.textContent = currentSize + 'rem';
        });
    }

    title.addEventListener('input', () => {
        updateFont(currentValue);
        title.style.fontSize = currentSize + 'rem';
    });
}

function initVariableFonts() {
    document.querySelectorAll('.section-title[data-font-family]').forEach(title => {
        const fontFamily = title.getAttribute('data-font-family');
        const config = fontConfigs[fontFamily];
        
        if (config) {
            title.setAttribute('contenteditable', 'true');
            title.setAttribute('spellcheck', 'false');
            title.style.setProperty('font-variation-settings', `'wght' ${config.defaultWght}, '${config.axis}' ${config.initialValue}`, 'important');
            animateAxis(title, config);
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVariableFonts);
} else {
    initVariableFonts();
}
