import React, {useRef, useCallback, useState, useEffect} from 'react';
import {getI18nMessage} from '../../public/chrome-call';
import './style.css';

let timeout = null;
const debounce = (cb, time) => {
    return () => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(cb, time);
    };
};

const RawText = ({defaultValue, rawTextTranslate}) => {
    const [lastText, setLastText] = useState('');

    const textareaEl = useRef(null);

    const handleRtTextChange = useCallback(
        () => {
            let text = textareaEl.current.value;
            text = text.trimLeft().trimRight();
            if (text === '' || text === lastText) return;
            setLastText(text);
            rawTextTranslate(text);
        },
        [lastText, rawTextTranslate]
    );

    useEffect(
        () => {
            if (defaultValue) {
                setLastText(defaultValue);
                textareaEl.current.value = defaultValue;
            }
        },
        [defaultValue]
    );

    useEffect(
        () => {
            textareaEl.current.focus();
        },
        []
    );

    return (
        <div className='ts-raw-text'>
            <textarea
                defaultValue={defaultValue}
                placeholder={getI18nMessage('contentInputHere')}
                onChange={debounce(handleRtTextChange, 500)}
                ref={textareaEl}
                className='ts-rt-text'
            ></textarea>
        </div>
    );
};

export default RawText;