import React, { useCallback, useEffect, useRef, useState } from 'react';
import IconFont from '../../../components/IconFont';
import { drag } from '../../../public/utils';
import OptionToggle from '../OptionToggle';
import './style.css';

const ContextMenusDraggable = ({ contextMenus, update }) => {
    const [draggingStyle, setDraggingStyle] = useState();
    const [tempContextMenus, setTempContextMenus] = useState([]);

    const containerRef = useRef();
    const itemsRef = useRef([]);

    useEffect(() => {
        itemsRef.current = itemsRef.current.slice(0, contextMenus.length);
        setTempContextMenus([...contextMenus]);
    }, [contextMenus]);

    const onMouseDown = useCallback((id, e) => {
        let moved = false;
        let transitionStyle = '';
        
        const currentIndex = itemsRef.current.findIndex(v => v.getAttribute('draggable-id') === id);

        if (currentIndex < 0) { return; }

        let movingIndex = currentIndex;
        const element = itemsRef.current[currentIndex];
        const elementHeight = element.clientHeight;
        let { top: dragLineY } = element.getBoundingClientRect();
        dragLineY += elementHeight / 2;

        const ladderList = itemsRef.current.map((v) => {
            const { top, bottom } = v.getBoundingClientRect();
            return { top: top + window.scrollY, bottom: bottom + window.scrollY };
        });

        const { left: x, top: y } = element.getBoundingClientRect();

        const mouseMoveOrScroll = () => {
            const tmpY = dragLineY + window.scrollY;
            movingIndex = ladderList.findIndex(v => tmpY <= v.bottom && tmpY > v.top);

            itemsRef.current.forEach((v, i) => {
                if (i === currentIndex) { return; }

                currentIndex < i && (i -= 1);

                if (i >= movingIndex && movingIndex >= 0) {
                    v.style = `${transitionStyle} transform: translateY(${elementHeight}px); transform: translateY(${elementHeight}px);`
                }
                else {
                    v.style = transitionStyle;
                }
            });
        };

        const onScroll = () => {
            mouseMoveOrScroll();
        };

        const mouseMoveCallback = ({ x, y }) => {
            if (!moved) {
                setDraggingStyle({ height: `${elementHeight}px` });
                window.addEventListener('scroll', onScroll);
                moved = true;
            }

            element.style = `position: fixed; width: ${containerRef.current.clientWidth}px; left: ${x}px; top: ${y}px;`

            dragLineY = y + elementHeight / 2;

            mouseMoveOrScroll();
        };

        const mouseUpCallback = ({ y }) => {
            if (moved) {
                window.removeEventListener('scroll', onScroll);
            }
            setDraggingStyle(null);

            itemsRef.current.forEach(v => v.style = '');

            const tmpY = y + elementHeight / 2 + window.scrollY;
            movingIndex = ladderList.findIndex(v => tmpY <= v.bottom && tmpY > v.top);

            if (movingIndex === currentIndex || movingIndex < 0) { return; }

            let temp = [...contextMenus];

            for (let i = currentIndex, time = currentIndex > movingIndex ? -1 : 1; i !== movingIndex; i += time) {
                [temp[i], temp[i + time]] = [temp[i + time], temp[i]];
            }

            setTempContextMenus(temp);
            setTimeout(() => update(temp), 100);
        };

        drag(e, { x, y }, mouseMoveCallback, mouseUpCallback);
    }, [contextMenus, update]);

    return (
        <div className='context-menus' ref={containerRef}>
            {tempContextMenus.map((value, index) => (<div key={value.id} draggable-id={value.id} ref={el => itemsRef.current[index] = el}>
                <div className='flex-justify-content-space-between draggable-item'>
                    <OptionToggle
                        id={value.id}
                        message={`contextMenus_${value.id}`}
                        checked={value.enabled}
                        onClick={() => {
                            update([...contextMenus.slice(0, index), { ...value, enabled: !value.enabled }, ...contextMenus.slice(index + 1, contextMenus.length)]);
                        }}
                    />
                    <IconFont iconName='#icon-move' onMouseDown={e => onMouseDown(value.id, e)} />
                </div>
            </div>))}
            {draggingStyle && <div style={draggingStyle}></div>}
        </div>
    );
};

export default ContextMenusDraggable;