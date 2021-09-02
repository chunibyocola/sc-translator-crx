import React, { useCallback, useEffect, useRef, useState } from 'react';
import { drag } from '../../public/utils';
import { Position } from '../../types';

type DraggableProps = {
    children: React.ReactNode;
    values: any[];
    onChange: (values: any[]) => void;
};

// Children must be a list of elements.
// Every item of children must be a wrapper that has the attribute of "draggable-id" and
// the wrapper must contain an element that has the class name "draggable-move".
const Draggable: React.FC<DraggableProps> = ({ children, onChange, values }) => {
    const [draggingStyle, setDraggingStyle] = useState<React.CSSProperties>();

    const draggableListRef = useRef<HTMLElement[]>([]);
    const draggableEleRef = useRef<HTMLDivElement>(null);
    const valuesRef = useRef<any[]>([]);

    const onMouseDown = useCallback((id: string, e: MouseEvent) => {
        let moved = false;
        let transitionStyle = '';
        
        const currentIndex = draggableListRef.current.findIndex(v => v.getAttribute('draggable-id') === id);

        if (currentIndex < 0) { return; }

        let movingIndex = currentIndex;
        const element = draggableListRef.current[currentIndex];
        const elementHeight = element.clientHeight;
        let { top: dragLineY } = element.getBoundingClientRect();
        dragLineY += elementHeight / 2;

        const ladderList = draggableListRef.current.map((v) => {
            const { top, bottom } = v.getBoundingClientRect();
            return { top: top + window.scrollY, bottom: bottom + window.scrollY };
        });

        const { left: x, top: y } = element.getBoundingClientRect();

        const mouseMoveOrScroll = () => {
            const tmpY = dragLineY + window.scrollY;
            movingIndex = ladderList.findIndex(v => tmpY <= v.bottom && tmpY > v.top);

            draggableListRef.current.forEach((v, i) => {
                if (i === currentIndex) { return; }

                currentIndex < i && (i -= 1);

                if (i >= movingIndex && movingIndex >= 0) {
                    v.setAttribute('style', `${transitionStyle} transform: translateY(${elementHeight}px); transform: translateY(${elementHeight}px);`);
                }
                else {
                    v.setAttribute('style', transitionStyle);
                }
            });
        };

        const onScroll = () => {
            mouseMoveOrScroll();
        };

        const mouseMoveCallback = ({ x, y }: Position) => {
            if (!moved) {
                setDraggingStyle({ height: `${elementHeight}px` });
                window.addEventListener('scroll', onScroll);
                moved = true;
            }

            element.setAttribute('style', `position: fixed; width: ${draggableEleRef.current?.clientWidth ?? 200}px; left: ${x}px; top: ${y}px;`);

            dragLineY = y + elementHeight / 2;

            mouseMoveOrScroll();
        };

        const mouseUpCallback = ({ y }: Position) => {
            if (moved) {
                window.removeEventListener('scroll', onScroll);
            }
            setDraggingStyle(undefined);

            draggableListRef.current.forEach(v => v.setAttribute('style', ''));

            const tmpY = y + elementHeight / 2 + window.scrollY;
            movingIndex = ladderList.findIndex(v => tmpY <= v.bottom && tmpY > v.top);

            if (movingIndex === currentIndex || movingIndex < 0) { return; }

            let temp = [...valuesRef.current];

            for (let i = currentIndex, time = currentIndex > movingIndex ? -1 : 1; i !== movingIndex; i += time) {
                [temp[i], temp[i + time]] = [temp[i + time], temp[i]];
            }

            onChange(temp);
        };

        drag(e, { x, y }, mouseMoveCallback, mouseUpCallback);
    }, [onChange]);

    useEffect(() => {
        if (!draggableEleRef.current) { return; }

        let draggableList: HTMLElement[] = [];
        let unmountedCallbackList: (() => void)[] = [];
        
        draggableEleRef.current.childNodes.forEach((node) => {
            const draggableId = (node as HTMLElement).getAttribute?.('draggable-id');
            const moveElement = draggableId && (node as HTMLElement).querySelector('.draggable-move');

            if (draggableId && moveElement) {
                draggableList.push(node as HTMLElement);

                const listener = (e: MouseEvent) => {
                    onMouseDown(draggableId, e)
                };

                (moveElement as HTMLElement).addEventListener('mousedown', listener);

                unmountedCallbackList.push(() => (moveElement as HTMLElement).removeEventListener('mousedown', listener));
            }
        });

        draggableListRef.current = draggableList;

        return () => unmountedCallbackList.forEach(callback => callback());
    }, [children, onMouseDown]);

    useEffect(() => {
        valuesRef.current = values;
    }, [values]);

    return (
        <div ref={draggableEleRef} className='draggable'>
            {children}
            {draggingStyle && <div style={draggingStyle}></div>}
        </div>
    );
};

export default Draggable;