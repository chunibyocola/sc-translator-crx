import React, { useCallback } from 'react';
import './style.css';
import { pointerDrag } from '../utils';

const barPointerOffsetTop = -2;

const MainColorBar = ({ top, topChange, width, height }) => {
    const handlePointerDrag = useCallback(({ y }) => {
        topChange(y);
    }, [topChange]);

    const handleMouseDown = useCallback((e) => {
        handlePointerDrag({ y: e.nativeEvent.offsetY });
        pointerDrag(e.target, { maxY: e.target.offsetHeight - 1 }, handlePointerDrag);
    }, [handlePointerDrag]);

    return (
        <div className='color-selector-bar' style={{width: `${width}px`, height: `${height}px`}} onMouseDown={handleMouseDown}>
            <div className='color-selector-bar-pointer' style={{top: `${top + barPointerOffsetTop}px`}}></div>
        </div>
    );
};

export default MainColorBar;