import React, { useEffect, useCallback, useState } from 'react';
import { RGB } from '..';
import Slider from '../../../../components/Slider';
import { getMessage } from '../../../../public/i18n';
import { hexToRgb, rgbToHex } from '../utils';
import './style.css';

type ColorAdjustProps = {
    selectedColor: RGB;
    adjust: (r: number, g: number, b: number) => void;
    opacity: number;
    opacityChange: (opacity: number) => void;
    save: (rgba: string) => void;
};

const ColorAdjust: React.FC<ColorAdjustProps> = ({ selectedColor, adjust, opacity, opacityChange, save }) => {
    const [hex, setHex] = useState('ff0000');

    useEffect(() => {
        setHex(rgbToHex(selectedColor.r, selectedColor.g, selectedColor.b));
    }, [selectedColor]);

    const handleRgbInputChange = useCallback((color: keyof RGB, e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = e.target.value.replace(/[^0-9]/ig, '');
        let tempColor = Number(inputValue);
        tempColor > 255 && (tempColor = 255);
        if (selectedColor[color] !== tempColor) {
            let temp = { ...selectedColor };
            temp[color] = tempColor;
            const { r, g, b } = temp;
            adjust(r, g, b);
        }
    }, [selectedColor, adjust]);

    const handleHexInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let tempHex = e.target.value.replace(/[^0-9a-fA-F]/ig, '').substring(0, 6);
        if (tempHex === hex) { return; }
        tempHex = tempHex.toUpperCase();
        setHex(tempHex);
        if (tempHex.length === 6) {
            const { r, g, b } = hexToRgb(tempHex);
            adjust(r, g, b);
        }
    }, [hex, adjust]);

    const handleSaveBtnClick = useCallback(() => {
        save(`rgba(${selectedColor.r},${selectedColor.g},${selectedColor.b},${opacity})`);
    }, [selectedColor, opacity, save]);

    return (
        <div className='color-selector-adjust'>
            <div className='color-selector-selected-color-outer'>
                <div className='color-selector-selected-color' style={{background: `rgba(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b}, ${opacity})`}}></div>
            </div>
            <div className='color-selector-adjust-rgb'>
                <label className='color-selector-adjust-rgb-label' htmlFor='adjust-h'>#</label>
                <input id='adjust-h' type='text' value={hex} onChange={handleHexInputChange} />
            </div>
            <div className='color-selector-adjust-rgb'>
                <label className='color-selector-adjust-rgb-label' htmlFor='adjust-r'>R</label>
                <input id='adjust-r' type='text' value={selectedColor.r} onChange={e => handleRgbInputChange('r', e)} onClick={e => (e.target as HTMLInputElement).select()} />
            </div>
            <div className='color-selector-adjust-rgb'>
                <label className='color-selector-adjust-rgb-label' htmlFor='adjust-g'>G</label>
                <input id='adjust-g' type='text' value={selectedColor.g} onChange={e => handleRgbInputChange('g', e)} onClick={e => (e.target as HTMLInputElement).select()} />
            </div>
            <div className='color-selector-adjust-rgb'>
                <label className='color-selector-adjust-rgb-label' htmlFor='adjust-b'>B</label>
                <input id='adjust-b' type='text' value={selectedColor.b} onChange={e => handleRgbInputChange('b', e)} onClick={e => (e.target as HTMLInputElement).select()} />
            </div>
            <div className='color-selector-adjust-rgb'>
                <label className='color-selector-adjust-rgb-label'>A</label>
                <input type='text' value={opacity} disabled/>
            </div>
            <Slider
                min={0}
                max={1}
                step={0.01}
                defaultValue={opacity}
                mouseDownCallback={v => opacityChange(Number(v.toFixed(2)))}
                mouseMoveCallback={v => opacityChange(Number(v.toFixed(2)))}
            />
            <button style={{width: '100%'}} onClick={handleSaveBtnClick}>{getMessage('themeSaveColor')}</button>
        </div>
    );
};

export default ColorAdjust;