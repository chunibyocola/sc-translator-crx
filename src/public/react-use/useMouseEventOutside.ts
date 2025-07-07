import { useEffect, useRef } from 'react';

type PickedMouseEventType = keyof Pick<
    WindowEventMap,
    'mousedown' |
    'mouseup' |
    'click'
>;

const useMouseEventOutside = (callback: () => void, mouseEvent: PickedMouseEventType, targetElement: HTMLElement | null | undefined, activate: boolean) => {
    const callbackRef = useRef<() => void>(undefined);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const onMouseEvent = (e: MouseEvent) => {
            if (targetElement && e.composedPath().includes(targetElement)) { return; }

            callbackRef.current?.();
        };

        targetElement && activate && window.addEventListener(mouseEvent, onMouseEvent, true);

        return () => window.removeEventListener(mouseEvent, onMouseEvent, true);
    }, [mouseEvent, targetElement, activate]);
};

export default useMouseEventOutside;