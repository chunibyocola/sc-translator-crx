import React, { useCallback, useEffect, useRef, useState } from 'react';
import IconFont from '../../../components/IconFont';
import './style.css';
import '../../../components/TsBtn/style.css';
import { pointerDrag } from '../ColorSelector/utils';
import { getMessage } from '../../../public/i18n';
import { Position } from '../../../types';
import Button from '../../../components/Button';
import PanelIconButtonWrapper from '../../../components/PanelIconButtons/PanelIconButtonWrapper';

type BtnPostionProps = {
    currentPos: Position;
    updateBtnPosition: (position: Position) => void;
};

const BtnPostion: React.FC<BtnPostionProps> = ({ currentPos, updateBtnPosition }) => {
    const [pos, setPos] = useState({ x: 5, y: 5 });

    const btnEle = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setPos(currentPos);
    }, [currentPos]);

    const handlePointerDrag = useCallback(({ x ,y }: Position) => {
        setPos({ x: ~~x - 50, y: ~~y - 50 });
    }, []);

    const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
        if (!btnEle.current) { return; }

        const target = e.target as HTMLDivElement;

        const maxX = target.offsetWidth - btnEle.current.offsetWidth;
        const maxY = target.offsetHeight - btnEle.current.offsetHeight;
        handlePointerDrag({ x: Math.min(e.nativeEvent.offsetX, maxX), y: Math.min(e.nativeEvent.offsetY, maxY) });
        pointerDrag(target, { maxX, maxY }, handlePointerDrag);
    }, [handlePointerDrag]);

    return (
        <div className='translate-button-position'>
            <div className='translate-button-position__display' onMouseDown={handleMouseDown}>
                <IconFont className='translate-button-position__cursor-default' iconName='#icon-cursorDefault' style={{pointerEvents: 'none'}} />
                <div
                    className='translate-button'
                    ref={btnEle}
                    style={{
                        pointerEvents: 'none',
                        top: `calc(50% + ${pos.y}px)`,
                        left: `calc(50% + ${pos.x}px)`,
                        position: 'absolute',
                        cursor: 'default',
                        zIndex: 1
                    }}
                >
                    <PanelIconButtonWrapper>
                        <IconFont iconName='#icon-MdTranslate' />
                    </PanelIconButtonWrapper>
                </div>
            </div>
            <Button variant='contained' onClick={() => updateBtnPosition(pos)} disabled={pos.x === currentPos.x && pos.y === currentPos.y}>{getMessage('wordSave')}</Button>
            <Button variant='text' onClick={() => setPos(currentPos)} disabled={pos.x === currentPos.x && pos.y === currentPos.y}>{getMessage('wordCancel')}</Button>
        </div>
    );
};

export default BtnPostion;