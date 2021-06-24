import React, { useRef, useCallback, useState, useEffect, useLayoutEffect } from 'react';
import { getMessage } from '../../public/i18n';
import useDebounce from '../../public/react-use/useDebounce';
import { textPreprocessing } from '../../public/text-preprocessing';
import './style.css';

const RawText = ({ defaultValue, rawTextTranslate, focusDependency, autoTranslateAfterInput }) => {
    const [debounceDependency, setDebounceDependency] = useState(0);

    const lastTextRef = useRef('');
    const stopPropagationRef = useRef(e => e.stopPropagation());
    const textareaEl = useRef(null);
    const compositionStatus = useRef(false);

    const rawTextChanged = useCallback(() => {
        setDebounceDependency(v => v + 1);
    }, []);

    const handleRawTextChanged = useCallback(() => {
        let text = textareaEl.current.value.trimLeft();

        if (!text || text.trimRight() === lastTextRef.current || !textPreprocessing(text)) { return; }

        lastTextRef.current = text.trimRight();

        rawTextTranslate(text);
    }, [rawTextTranslate]);

    useDebounce(handleRawTextChanged, 600, [debounceDependency]);

    const onCompositionStart = useCallback(() => {
        compositionStatus.current = true;
    }, []);

    const onCompositionEnd = useCallback(() => {
        compositionStatus.current = false;
        autoTranslateAfterInput && rawTextChanged();
    }, [rawTextChanged, autoTranslateAfterInput]);

    const onChange = useCallback(() => {
        autoTranslateAfterInput && !compositionStatus.current && rawTextChanged();
    }, [rawTextChanged, autoTranslateAfterInput]);

    const onFocus = useCallback(() => {
        window.addEventListener('keydown', stopPropagationRef.current, true);
        window.addEventListener('keyup', stopPropagationRef.current, true);
    }, []);

    const onBlur = useCallback(() => {
        window.removeEventListener('keydown', stopPropagationRef.current, true);
        window.removeEventListener('keyup', stopPropagationRef.current, true);
    }, []);

    useEffect(() => {
        if (defaultValue) {
            lastTextRef.current = defaultValue.trimRight();
            textareaEl.current.value = defaultValue;
        }
    }, [defaultValue]);

    useEffect(() => {
        textareaEl.current.focus();
        textareaEl.current.select();
    }, [focusDependency]);

    useLayoutEffect(() => {
        const tempRef = textareaEl.current;

        const onRawTextKeyDown = (e) => {
            if (e.ctrlKey && e.keyCode === 13) {
                e.preventDefault();
                handleRawTextChanged();
            }
        };

        !autoTranslateAfterInput && tempRef.addEventListener('keydown', onRawTextKeyDown);

        return () => !autoTranslateAfterInput && tempRef.removeEventListener('keydown', onRawTextKeyDown);
    }, [handleRawTextChanged, autoTranslateAfterInput]);

    return (
        <div className='ts-raw-text'>
            <textarea
                defaultValue={defaultValue}
                placeholder={getMessage('contentInputHere')}
                onChange={onChange}
                onCompositionStart={onCompositionStart}
                onCompositionEnd={onCompositionEnd}
                onFocus={onFocus}
                onBlur={onBlur}
                ref={textareaEl}
                className='ts-rt-text'
            ></textarea>
        </div>
    );
};

export default RawText;