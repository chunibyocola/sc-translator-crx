export const pointerDrag = (element, { maxX = 0, maxY = 0 }, mouseMoveCallback, mouseUpCallback) => {
    const { left, top } = element.getBoundingClientRect();

    const calculate = (x, y) => {
        x = x >= 0 ? x <= maxX ? x : maxX : 0;
        y = y >= 0 ? y <= maxY ? y : maxY : 0;
        return { x, y };
    };

    document.onselectstart = () => { return false; };

    document.onmousemove = (e) => {
        mouseMoveCallback && mouseMoveCallback(calculate(e.clientX - left, e.clientY - top));
    };

    document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
        document.onselectstart = () => { return true; };

        mouseUpCallback && mouseUpCallback(calculate(e.clientX - left, e.clientY - top));
    };
};

export const rgbToHex = (r, g, b) => {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);

    r.length === 1 && (r = '0' + r);
    g.length === 1 && (g = '0' + g);
    b.length === 1 && (b = '0' + b);

    return (r + g + b).toUpperCase();
};

export const hexToRgb = (hex) => {
    if (hex.length !== 6) { return { r: 0, g: 0, b: 0 }; }

    hex = hex.toLowerCase();

    let numArr = [0, 0, 0];
    for (let i = 0; i < 6; i++) {
        const arrIndex = Math.floor(i / 2);
        const mulValue = i % 2 === 0 ? 16 : 1;
        let plusValue = 0;
        if ('0' <= hex[i] && hex[i] <= '9') { plusValue = (hex[i].charCodeAt(0) - '0'.charCodeAt(0)) * mulValue; }
        else if ('a' <= hex[i] && hex[i] <= 'f') { plusValue = (hex[i].charCodeAt(0) - 'a'.charCodeAt(0) + 10) * mulValue; }
        numArr[arrIndex] = numArr[arrIndex] + plusValue;
    }

    return { r: numArr[0], g: numArr[1], b: numArr[2] };
};

export const getBarTopByMainColor = (r, g, b, h) => {
    const singleBlockHeight = h / 6;
    if (r === 255 && g === 0) { return b / 255 * singleBlockHeight; }
    else if (b === 255 && g === 0) { return 2 * singleBlockHeight - r / 255 * singleBlockHeight; }
    else if (b === 255 && r === 0) { return 2 * singleBlockHeight + g / 255 * singleBlockHeight; }
    else if (g === 255 && r === 0) { return 4 * singleBlockHeight - b / 255 * singleBlockHeight; }
    else if (g === 255 && b === 0) { return 4 * singleBlockHeight + r / 255 * singleBlockHeight; }
    else if (r === 255 && b === 0) { return 6 * singleBlockHeight - g / 255 * singleBlockHeight; }
    return 0;
};

export const getMainColorByBarTop = (y, h) => {
    const singleBlockHeight = h / 6;
    const beloneBlock = Math.floor(y / singleBlockHeight);
    const pointerBlockLength = y % singleBlockHeight;
    const rgbLength = Math.floor(255 * pointerBlockLength / singleBlockHeight);

    if (beloneBlock === 0) { return { r: 255, g: 0, b: rgbLength }; }
    else if (beloneBlock === 1) { return { r: 255 - rgbLength, g: 0, b: 255 }; }
    else if (beloneBlock === 2) { return { r: 0, g: rgbLength, b: 255 }; }
    else if (beloneBlock === 3) { return { r: 0, g: 255, b: 255 - rgbLength }; }
    else if (beloneBlock === 4) { return { r: rgbLength, g: 255, b: 0 }; }
    else if (beloneBlock === 5) { return { r: 255, g: 255 - rgbLength, b: 0 }; }
    return { r: 255, g: 0, b: 0 };
};

export const getXYMainColorByRgb = (r, g, b, w, h) => {
    // f(r) = (255 - (255 - xR) * pointerX / w) * (1 - pointerY / h)
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let mid = r + g + b - max - min;
    let pointerY = (1 - max / 255) * h;
    let pointerX = (1 - (min / 255 / (1 - pointerY / h))) * w;
    let midColor = 255 - (255 - mid / (1 - pointerY / h)) / (pointerX / w);
    r = Math.floor(r === max ? 255 : r === mid ? midColor : 0);
    g = Math.floor(g === max ? 255 : g === mid ? midColor : 0);
    b = Math.floor(b === max ? 255 : b === mid ? midColor : 0);
    let x = Math.floor(pointerX);
    let y = Math.floor(pointerY);
    if (r === g && g === b) {
        x = 0;
        r = 255;
        g = 0;
        b = 0;
    }
    return { x, y, r, g, b };
    // 235 = (255 - (255 - 255) * x1) * y1
    // 235 = 255 * y1
    // 0.921569 = 1 - y / h
    // y / h = 0.078431
    // y = 20.078336

    // 72 = (255 - (255 - 0) * x1) * y1
    // 72 = 255y1 - 255x1y1
    // 0.282353 = (1 - x1)y1
    // 0.306383 = 1 - x1
    // x1 = 0.693617 = x / w
    // x = 177.565952

    // 209 = (255 - (255 - mid) * 0.691406) * 0.921875
    // 226.711864 = 255 - (255 - mid) * 0.691406
    // 28.288136 = (255 - mid) * 0.691406
    // 40.913929 = 255 - mid
    // mid = 214.086071
};

export const calculateColor = (x, y, w, h, mainColor) => {
    // f(r) = (255 - (255 - xR) * pointerX / w) * (1 - pointerY / h)
    let { r, g, b } = mainColor;
    let rX = (255 - (255 - r) * x / w);
    let gX = (255 - (255 - g) * x / w);
    let bX = (255 - (255 - b) * x / w);

    let rR = Math.floor(rX * (1 - y / h));
    let gR = Math.floor(gX * (1 - y / h));
    let bR = Math.floor(bX * (1 - y / h));

    return { r: rR, g: gR, b: bR };
};