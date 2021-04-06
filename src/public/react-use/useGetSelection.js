import { useEffect, useRef } from 'react';
import { getSelectedText } from '../utils/get-selection';

const useGetSelection = (selectCallback, unselectCallback) => {
    const selectRef = useRef();
    const unselectRef = useRef();
    const lastSelectionTextRef = useRef('');

    useEffect(() => {
        selectRef.current = selectCallback;
    }, [selectCallback]);

    useEffect(() => {
        unselectRef.current = unselectCallback;
    }, [unselectCallback]);

    useEffect(() => {
        const onMouseUp = (e) => {
            setTimeout(() => {
                const text = getSelectedText();

                if (!text || lastSelectionTextRef.current === text) { return; }

                lastSelectionTextRef.current = text;

                selectRef.current({
                    pos: { x: e.clientX, y: e.clientY },
                    text
                });
            }, 0);
        };
        
        const onMouseDown = () => {
            lastSelectionTextRef.current = '';
            unselectRef.current();
        };
    
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousedown', onMouseDown);
    
        return () => {
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mousedown', onMouseDown);
        };
    }, []);
};

export default useGetSelection;