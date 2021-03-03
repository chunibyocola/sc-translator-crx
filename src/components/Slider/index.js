import React, { useCallback, useEffect, useRef, useState } from 'react';
import { pointerDrag } from '../../entry/options/ColorSelector/utils';
import './style.css';

const Slider = ({ defaultValue, min, max, step, marks, valueLabelDisplay, valueLabelFormat, mouseDownCallback, mouseMoveCallback, mouseUpCallback }) => {
    const [pointerLeft, setPointerLeft] = useState(0);
    const [value, setValue] = useState(0);

    const sliderEle = useRef(null);

    const calculateValueByX = useCallback((x) => {
        let value = (x / (sliderEle.current?.offsetWidth ?? 1)) * (max - min) + min;
        return step ? (value / step).toFixed(0) * step : value;
    }, [min, max, step]);

    const calculatePointerLeftByValue = useCallback((value) => {
        return (value - min) / (max - min) * 100;
    }, [min, max]);

    const handleValueChange = useCallback((value) => {
        setValue(value);
        setPointerLeft(calculatePointerLeftByValue(value));
    }, [calculatePointerLeftByValue]);

    const handleSliderMouseMove = useCallback(({ x }) => {
        const value = calculateValueByX(x);
        mouseMoveCallback && mouseMoveCallback(value);
        handleValueChange(value);
    }, [mouseMoveCallback, calculateValueByX, handleValueChange]);

    const handleSliderMouseUp = useCallback(({ x }) => {
        mouseUpCallback && mouseUpCallback(calculateValueByX(x));
    }, [mouseUpCallback, calculateValueByX]);

    const handleSliderMouseDown = useCallback((e) => {
        const value = calculateValueByX(e.nativeEvent.offsetX);
        mouseDownCallback && mouseDownCallback(value);
        pointerDrag(e.target, { maxX: e.target.offsetWidth }, handleSliderMouseMove, handleSliderMouseUp);
        handleValueChange(value);
    }, [handleSliderMouseMove, handleSliderMouseUp, mouseDownCallback, calculateValueByX, handleValueChange]);

    const handleMarkMouseDown = useCallback((value) => {
        mouseUpCallback && mouseUpCallback(value);
        handleValueChange(value);
    }, [mouseUpCallback, handleValueChange]);

    useEffect(() => {
        handleValueChange(defaultValue);
    }, [defaultValue, handleValueChange]);

    return (
        <div ref={sliderEle} className='ts-slider' onMouseDown={handleSliderMouseDown}>
            <div className='ts-slider-rail'></div>
            <div className='ts-slider-track' style={{width: `${pointerLeft}%`}}></div>
            <div className='ts-slider-pointer' style={{left: `${pointerLeft}%`}}></div>
            {valueLabelDisplay && <div
                className='ts-slider-label'
                style={{left: `${pointerLeft}%`}}
            >
                {valueLabelFormat ? valueLabelFormat(value) : value}
            </div>}
            {marks && marks.map((v, i) => (<>
                <span className={`ts-slider-mark${value > v.value ? ' ts-slider-mark-active' : ''}`} style={{left: `${calculatePointerLeftByValue(v.value)}%`}}></span>
                <span
                    key={i}
                    className='ts-slider-mark-label'
                    style={{left: `${calculatePointerLeftByValue(v.value)}%`}}
                    onMouseDown={(e) => {
                        handleMarkMouseDown(v.value);
                        e.stopPropagation();
                    }}
                >
                    {v.label}
                </span>
            </>))}
        </div>
    );
};

export default Slider;