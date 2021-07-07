import React, { useCallback, useEffect, useRef, useState } from 'react';
import { pointerDrag } from '../../entry/options/ColorSelector/utils';
import { Position } from '../../types';
import './style.css';

export type SliderMarks = {
    value: number;
    label: string;
}[];

export type SliderFormat = (value: number) => string | number;

type SliderProps = {
    defaultValue: number;
    min: number;
    max: number;
    step?: number;
    marks?: SliderMarks;
    valueLabelDisplay?: boolean;
    valueLabelFormat?: SliderFormat
    mouseDownCallback?: (value: number) => void;
    mouseMoveCallback?: (value: number) => void;
    mouseUpCallback?: (value: number) => void;
};

const Slider: React.FC<SliderProps> = ({ defaultValue, min, max, step, marks, valueLabelDisplay, valueLabelFormat, mouseDownCallback, mouseMoveCallback, mouseUpCallback }) => {
    const [pointerLeft, setPointerLeft] = useState(0);
    const [value, setValue] = useState(0);

    const sliderEle = useRef<HTMLDivElement>(null);

    const calculateValueByX = useCallback((x: number) => {
        let value = (x / (sliderEle.current?.offsetWidth ?? 1)) * (max - min) + min;
        return step ? Math.round(value / step) * step : value;
    }, [min, max, step]);

    const calculatePointerLeftByValue = useCallback((value) => {
        return (value - min) / (max - min) * 100;
    }, [min, max]);

    const handleValueChange = useCallback((value: number) => {
        setValue(value);
        setPointerLeft(calculatePointerLeftByValue(value));
    }, [calculatePointerLeftByValue]);

    const handleSliderMouseMove = useCallback(({ x }: Position) => {
        const value = calculateValueByX(x);
        mouseMoveCallback?.(value);
        handleValueChange(value);
    }, [mouseMoveCallback, calculateValueByX, handleValueChange]);

    const handleSliderMouseUp = useCallback(({ x }: Position) => {
        mouseUpCallback?.(calculateValueByX(x));
    }, [mouseUpCallback, calculateValueByX]);

    const handleSliderMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const value = calculateValueByX(e.nativeEvent.offsetX);
        mouseDownCallback?.(value);
        const targetElement = e.target as HTMLDivElement;
        pointerDrag(targetElement, { maxX: targetElement.offsetWidth }, handleSliderMouseMove, handleSliderMouseUp);
        handleValueChange(value);
    }, [handleSliderMouseMove, handleSliderMouseUp, mouseDownCallback, calculateValueByX, handleValueChange]);

    const handleMarkMouseDown = useCallback((value) => {
        mouseUpCallback?.(value);
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
                {valueLabelFormat?.(value) ?? value}
            </div>}
            {marks?.map((v, i) => (<>
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