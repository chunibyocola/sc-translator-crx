import React, { useRef, useCallback, useState, useEffect } from 'react';
import { getMessage } from '../../public/i18n';
import { debounce } from '../../public/utils';
import './style.css';

const RawText = ({ defaultValue, rawTextTranslate, focusDependency }) => {
    const [lastText, setLastText] = useState('');

    const textareaEl = useRef(null);
    const compositionStatus = useRef(false);
    const debounceHandleRtTextChange = useRef(null);

    const handleRtTextChange = useCallback(() => {
        let text = textareaEl.current.value;
        text = text.trimLeft().trimRight();
        if (text === '' || text === lastText) return;
        setLastText(text);
        rawTextTranslate(text);
    }, [lastText, rawTextTranslate]);

    const onCompositionStart = useCallback(() => {
        compositionStatus.current = true;
    }, []);

    const onCompositionEnd = useCallback(() => {
        compositionStatus.current = false;
        debounceHandleRtTextChange.current();
    }, []);

    const onChange = useCallback(() => {
        !compositionStatus.current && debounceHandleRtTextChange.current();
    }, []);

    useEffect(() => {
        debounceHandleRtTextChange.current = debounce(handleRtTextChange, 600);
    }, [handleRtTextChange]);

    useEffect(() => {
        if (defaultValue) {
            setLastText(defaultValue);
            textareaEl.current.value = defaultValue;
        }
    }, [defaultValue]);

    useEffect(() => {
        textareaEl.current.focus();
    }, []);

    useEffect(() => {
        // use setTimeout(..., 0) is because it doesn't work in multipleTranslateMode without setTimeout
        focusDependency && setTimeout(() => {
            textareaEl.current.focus();
            textareaEl.current.select();
        }, 0);
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