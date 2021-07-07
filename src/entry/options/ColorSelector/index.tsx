import React, { useCallback, useEffect, useState } from 'react';
import ColorAdjust from './ColorAdjust';
import MainColorBar from './MainColorBar';
import Platter from './Platter';
import { getMainColorByBarTop, calculateColor, getXYMainColorByRgb, getBarTopByMainColor } from './utils';
import './style.css';

export type RGB = { r: number; g: number; b: number; };

const mainColorBarRect = { w: 20, h: 300 };
const platterRect = { w: 300, h: 300 };

type ColorSelectorProps = {
    initColor: string;
    save: (rgba: string) => void;
    update: (rgba: string) => void;
};

const ColorSelector: React.FC<ColorSelectorProps> = ({ initColor, save, update }) => {
    const [mainColor, setMainColor] = useState<RGB>({ r: 255, g: 0, b: 0 });
    const [selectedColor, setSelectedColor] = useState({ r: 255, g: 0, b: 0 });
    const [platterPos, setPlatterPos] = useState({ x: platterRect.w, y: 0 });
    const [barTop, setBarTop] = useState(0);
    const [opacity, setOpacity] = useState(1);

    const updateStateByRgb = useCallback((aR: number, aG: number, aB: number) => {
        const { x, y, r, g, b } = getXYMainColorByRgb(aR, aG, aB, platterRect.w, platterRect.h);
        setMainColor({ r, g, b });
        setBarTop(getBarTopByMainColor(r, g, b, mainColorBarRect.h));
        setPlatterPos({ x, y });
        setSelectedColor({ r: aR, g: aG, b: aB });
    }, []);

    useEffect(() => {
        const arr = initColor.replace(/\s|rgba|\(|\)/ig, '').split(',');
        let [sR, sG, sB, sA] = arr;
        let r = Number(sR);
        let g = Number(sG);
        let b = Number(sB);
        let a = Number(sA);
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