import React, { useRef, useCallback, useState, useEffect } from 'react';
import { getMessage } from '../../public/i18n';
import useDebounce from '../../public/react-use/useDebounce';
import './style.css';

const RawText = ({ defaultValue, rawTextTranslate, focusDependency }) => {
    const [debounceDependency, setDebounceDependency] = useState(0);

    const lastTextRef = useRef('');
    const textareaEl = useRef(null);
    const compositionStatus = useRef(false);

    const rawTextChanged = useCallback(() => {
        setDebounceDependency(v => v + 1);
    }, []);

    const handleRawTextChanged = useCallback(() => {
        let text = textareaEl.current.value.trimLeft();

        if (!text || text.trimRight() === lastTextRef.current) { return; }

        lastTextRef.current = text.trimRight();

        rawTextTranslate(text);
    }, [rawTextTranslate]);

    useDebounce(handleRawTextChanged, 600, [debounceDependency]);

    const onCompositionStart = useCallback(() => {
        compositionStatus.current = true;
    }, []);

    const onCompositionEnd = useCallback(() => {
        compositionStatus.current = false;
        rawTextChanged();
    }, [rawTextChanged]);

    const onChange = useCallback(() => {
        !compositionStatus.current && rawTextChanged();
    }, [rawTextChanged]);

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

    return (
        <div className='ts-raw-text'>
            <textarea
                defaultValue={defaultValue}
                placeholder={getMessage('contentInputHere')}
                onChange={onChange}
                onCompositionStart={onCompositionStart}
                onCompositionEnd={onCompositionEnd}
                ref={textareaEl}
                className='ts-rt-text'
            ></textarea>
        </div>
    );
};

export default RawText;