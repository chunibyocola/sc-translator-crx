import React, { useCallback, useEffect, useState } from 'react';
import ColorAdjust from './ColorAdjust';
import MainColorBar from './MainColorBar';
import Platter from './Platter';
import { getMainColorByBarTop, calculateColor, getXYMainColorByRgb, getBarTopByMainColor } from './utils';
import './style.css';

const mainColorBarRect = { w: 20, h: 300 };
const platterRect = { w: 300, h: 300 };

const ColorSelector = ({ initColor, save, update }) => {
    const [mainColor, setMainColor] = useState({ r: 255, g: 0, b: 0 });
    const [selectedColor, setSelectedColor] = useState({ r: 255, g: 0, b: 0 });
    const [platterPos, setPlatterPos] = useState({ x: platterRect.w, y: 0 });
    const [barTop, setBarTop] = useState(0);
    const [opacity, setOpacity] = useState(1);

    const updateStateByRgb = useCallback((aR, aG, aB) => {
        const { x, y, r, g, b } = getXYMainColorByRgb(aR, aG, aB, platterRect.w, platterRect.h);
        setMainColor({ r, g, b });
        setBarTop(getBarTopByMainColor(r, g, b, mainColorBarRect.h));
        setPlatterPos({ x, y });
        setSelectedColor({ r: aR, g: aG, b: aB });
    }, []);

    useEffect(() => {
        const arr = initColor.replace(/\s|rgba|\(|\)/ig, '').split(',');
        let [r, g, b, a] = arr;
        r = Number(r);
        g = Number(g);
        b = Number(b);
        a = Number(a);
        updateStateByRgb(r, g, b);
        setOpacity(a);
    }, [initColor, updateStateByRgb]);

    const handleUpdateColor = useCallback((selectedColor, opacity) => {
        setOpacity(opacity);
        update(`rgba(${selectedColor.r},${selectedColor.g},${selectedColor.b},${opacity})`);
    }, [update]);

    const handleOpacityChange = useCallback((opacity) => {
        handleUpdateColor(selectedColor, opacity);
    }, [handleUpdateColor, selectedColor]);

    const handleBarTopChange = useCallback((y) => {
        const tempMainColor = getMainColorByBarTop(y, mainColorBarRect.h);
        setMainColor(tempMainColor);
        const tempSelectedColor = calculateColor(platterPos.x, platterPos.y, platterRect.w, platterRect.h, tempMainColor);
        setSelectedColor(tempSelectedColor);
        setBarTop(y);

        handleUpdateColor(tempSelectedColor, opacity);
    }, [platterPos, handleUpdateColor, opacity]);

    const handlePlatterPosChange = useCallback((x, y) => {
        const tempSelectedColor = calculateColor(x, y, platterRect.w, platterRect.h, mainColor);
        setSelectedColor(tempSelectedColor);
        setPlatterPos({ x, y });

        handleUpdateColor(tempSelectedColor, opacity);
    }, [mainColor, handleUpdateColor, opacity]);

    const handleColorAdjust = useCallback((aR, aG, aB) => {
        updateStateByRgb(aR, aG, aB);

        handleUpdateColor({ r: aR, g: aG, b: aB }, opacity);
    }, [handleUpdateColor, opacity, updateStateByRgb]);

    return (
        <div className='color-selector'>
            <Platter
                mainColor={mainColor}
                pos={platterPos}
                posChange={handlePlatterPosChange}
                width={platterRect.w}
                height={platterRect.h}
            />
            <MainColorBar
                top={barTop}
                topChange={handleBarTopChange}
                width={mainColorBarRect.w}
                height={mainColorBarRect.h}
            />
            <ColorAdjust
                mainColor={mainColor}
                selectedColor={selectedColor}
                adjust={handleColorAdjust}
                opacity={opacity}
                opacityChange={handleOpacityChange}
                save={save}
            />
        </div>
    );
};

export default ColorSelector;