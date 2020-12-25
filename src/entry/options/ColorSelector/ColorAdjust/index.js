import React, { useEffect, useCallback, useState, useRef } from 'react';
import { hexToRgb, rgbToHex, pointerDrag } from '../utils';
import './style.css';

const ColorAdjust = ({ selectedColor, adjust, opacity, opacityChange, save }) => {
    const [hex, setHex] = useState('ff0000');

    const sliderEle = useRef(null);

    useEffect(() => {
        setHex(rgbToHex(selectedColor.r, selectedColor.g, selectedColor.b));
    }, [selectedColor]);

    const handleRgbInputChange = useCallback((color, e) => {
        let tempColor = e.target.value.replace(/[^0-9]/ig, '');
        tempColor = Number(tempColor);
        tempColor > 255 && (tempColor = 255);
        if (selectedColor[color] !== tempColor) {
            let temp = { ...selectedColor };
            temp[color] = tempColor;
            const { r, g, b } = temp;
            adjust(r, g, b);
        }
    }, [selectedColor, adjust]);

    const handleHexInputChange = useCallback((e) => {
        let tempHex = e.target.value.replace(/[^0-9a-fA-F]/ig, '').substring(0, 6);
        if (tempHex === hex) { return; }
        tempHex = tempHex.toUpperCase();
        setHex(tempHex);
        if (tempHex.length === 6) {
            const { r, g, b } = hexToRgb(tempHex);
            adjust(r, g, b);
        }
    }, [hex, adjust]);

    const handleSliderPointerDrag = useCallback(({ x }) => {
        const value = x === sliderEle.current.offsetWidth ? 1 : (x / sliderEle.current.offsetWidth).toFixed(2);
        opacityChange(value);
    }, [opacityChange]);

    const handleSliderMouseDown = useCallback((e) => {
        const value = e.nativeEvent.offsetX + 1 === sliderEle.current.offsetWidth ? 1 : ((e.nativeEvent.offsetX + 1) / sliderEle.current.offsetWidth).toFixed(2);
        opacityChange(value);
        pointerDrag(e.target, { maxX: e.target.offsetWidth }, handleSliderPointerDrag);
    }, [handleSliderPointerDrag, opacityChange]);

    const handleSaveBtnClick = useCallback(() => {
        save(`rgba(${selectedColor.r},${selectedColor.g},${selectedColor.b},${opacity})`);
    }, [selectedColor, opacity, save]);

    return (
        <div className='color-selector-adjust'>
            <div className='color-selector-selected-color' style={{background: `rgba(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b}, ${opacity})`}}></div>
            <div className='color-selector-adjust-rgb'>
                <label className='color-selector-adjust-rgb-label' htmlFor='adjust-r'>R</label>
                <input id='adjust-r' type='text' value={selectedColor.r} onChange={e => handleRgbInputChange('r', e)} onClick={e => e.target.select()} />
            </div>
            <div className='color-selector-adjust-rgb'>
                <label className='color-selector-adjust-rgb-label' htmlFor='adjust-g'>G</label>
                <input id='adjust-g' type='text' value={selectedColor.g} onChange={e => handleRgbInputChange('g', e)} onClick={e => e.target.select()} />
            </div>
            <div className='color-selector-adjust-rgb'>
                <label className='color-selector-adjust-rgb-label' htmlFor='adjust-b'>B</label>
                <input id='adjust-b' type='text' value={selectedColor.b} onChange={e => handleRgbInputChange('b', e)} onClick={e => e.target.select()} />
            </div>
            <div className='color-selector-adjust-rgb'>
                <label className='color-selector-adjust-rgb-label' htmlFor='adjust-h'>#</label>
                <input id='adjust-h' type='text' value={hex} onChange={handleHexInputChange} />
            </div>
            <div className='color-selector-adjust-opacity'>
                Opacity
                <span className='color-selector-opacity-display'>{opacity}</span>
                <div ref={sliderEle} className='color-selector-opacity-slider' onMouseDown={handleSliderMouseDown}>
                    <div className='color-selector-opacity-rail'></div>
                    <div className='color-selector-opacity-track' style={{width: `${opacity * 100}%`}}></div>
                    <div className='color-selector-opacity-pointer' style={{left: `${opacity * 100}%`}}></div>
                </div>
            </div>
            <div className={'color-selector-adjust-save'} onClick={handleSaveBtnClick}>
                Save
            </div>
        </div>
    );
};

export default ColorAdjust;