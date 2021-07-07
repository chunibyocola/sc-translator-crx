import React, { useCallback } from 'react';
import './style.css';
import { pointerDrag } from '../utils';
import { Position } from '../../../../types';

const barPointerOffsetTop = -2;

type MainColorBarProps = {
    top: number;
    topChange: (top: number) => void;
    width: number;
    height: number;
};

const MainColorBar: React.FC<MainColorBarProps> = ({ top, topChange, width, height }) => {
    const handlePointerDrag = useCallback(({ y }: Pick<Position, 'y'>) => {
        topChange(y);
    }, [topChange]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        handlePointerDrag({ y: e.nativeEvent.offsetY });
        const targetElement = e.target as HTMLDivElement;
        pointerDrag(targetElement, { maxY: targetElement.offsetHeight - 1 }, handlePointerDrag);
    }, [handlePointerDrag]);

    return (
        <div className='color-selector-bar' style={{width: `${width}px`, height: `${height}px`}} onMouseDown={handleMouseDown}>
            <div className='color-selector-bar-pointer' style={{top: `${top + barPointerOffsetTop}px`}}></div>
        </div>
    );
};

export default MainColorBar;