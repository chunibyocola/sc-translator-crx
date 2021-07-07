import { useEffect, useRef } from 'react';
import { Position } from '../../types';
import { setSelectionRange } from '../insert-result';
import { textPreprocessing } from '../text-preprocessing';
import { isTextBox } from '../utils';
import { getSelectedText } from '../utils/get-selection';

const useGetSelection = (selectCallback: (params: { pos: Position, text: string }) => void, unselectCallback: () => void) => {
    const selectRef = useRef<(params: { pos: Position, text: string }) => void>();
    const unselectRef = useRef<() => void>();
    const lastSelectionTextRef = useRef('');

    useEffect(() => {
        selectRef.current = selectCallback;
    }, [selectCallback]);

    useEffect(() => {
        unselectRef.current = unselectCallback;
    }, [unselectCallback]);

    useEffect(() => {
        const onMouseUp = (e: MouseEvent) => {
            setTimeout(() => {
                const text = getSelectedText();

                if (!text || lastSelectionTextRef.current === text || !textPreprocessing(text)) { return; }

                // insert result
                let selection = window.getSelection();
                if (selection && selection.rangeCount > 0 && document.activeElement && !isTextBox(document.activeElement)) {
                    let selectionRange = selection.getRangeAt(0).cloneRange();
                    selectionRange.collapse(false);
                   setSelectionRange(selectionRange, text);
                }

                lastSelectionTextRef.current = text;

                selectRef.current?.({
                    pos: { x: e.clientX, y: e.clientY },
                    text
                });
            }, 0);
        };
        
        const onMouseDown = () => {
            lastSelectionTextRef.current = '';
            unselectRef.current?.();
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