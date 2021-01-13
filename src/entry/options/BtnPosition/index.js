import React, { useCallback, useEffect, useRef, useState } from 'react';
import IconFont from '../../../components/IconFont';
import './style.css';
import '../../../components/TsBtn/style.css';
import { pointerDrag } from '../ColorSelector/utils';
import { getMessage } from '../../../public/i18n';

const BtnPostion = ({ currentPos, updateBtnPostion }) => {
    const [pos, setPos] = useState({ x: 5, y: 5 });

    const btnEle = useRef(null);

    useEffect(() => {
        setPos(currentPos);
    }, [currentPos]);

    const handlePointerDrag = useCallback(({ x ,y }) => {
        setPos({ x: ~~x - 50, y: ~~y - 50 });
    }, []);

    const handleMouseDown = useCallback((e) => {
        const maxX = e.target.offsetWidth - btnEle.current.offsetWidth;
        const maxY = e.target.offsetHeight - btnEle.current.offsetHeight;
        handlePointerDrag({ x: Math.min(e.nativeEvent.offsetX, maxX), y: Math.min(e.nativeEvent.offsetY, maxY) });
        pointerDrag(e.target, { maxX, maxY }, handlePointerDrag);
    }, [handlePointerDrag]);

    return (
        <div className='btn-position'>
            <div className='btn-display' onMouseDown={handleMouseDown}>
                <IconFont className='btn-cursor-default' iconName='#icon-cursorDefault' style={{pointerEvents: 'none'}} />
                <div
                    className='ts-btn'
                    ref={btnEle}
                    style={{
                        pointerEvents: 'none',
                        top: `calc(50% + ${pos.y}px)`,
                        left: `calc(50% + ${pos.x}px)`,
                        position: 'absolute',
                        cursor: 'default'
                    }}
                >
                    <IconFont iconName='#icon-MdTranslate' style={{display: 'block'}} />
                </div>
            </div>
            <button onClick={() => updateBtnPostion(pos)} disabled={pos.x === currentPos.x && pos.y === currentPos.y}>{getMessage('wordSave')}</button>
            <button onClick={() => setPos(currentPos)} disabled={pos.x === currentPos.x && pos.y === currentPos.y}>{getMessage('wordCancel')}</button>
        </div>
    );
};

export default BtnPostion;