import React, { useRef, useCallback, useState, useEffect, useLayoutEffect } from 'react';
import { getMessage } from '../../public/i18n';
import { useAppSelector, useOptions } from '../../public/react-use';
import useDebounce from '../../public/react-use/useDebounce';
import { textPreprocessing } from '../../public/text-preprocessing';
import { DefaultOptions } from '../../types';
import './style.css';

type RawTextProps = {
    defaultValue: string;
    rawTextTranslate: (text: string) => void;
};

type PickedOptions = Pick<DefaultOptions, 'autoTranslateAfterInput'>;
const useOptionsDependency: (keyof PickedOptions)[] = ['autoTranslateAfterInput'];

const RawText: React.FC<RawTextProps> = ({ defaultValue, rawTextTranslate }) => {
    const [debounceDependency, setDebounceDependency] = useState(0);

    const { autoTranslateAfterInput } = useOptions<PickedOptions>(useOptionsDependency);
    const { focusFlag } = useAppSelector(state => state.panelStatus);

    const lastTextRef = useRef('');
    const textareaEl = useRef<HTMLTextAreaElement>(null);
    const compositionStatus = useRef(false);

    const rawTextChanged = useCallback(() => {
        setDebounceDependency(v => v + 1);
    }, []);

    const handleRawTextChanged = useCallback(() => {
        if (!textareaEl.current) { return; }

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

    useEffect(() => {
        if (defaultValue) {
            lastTextRef.current = defaultValue.trimRight();
            textareaEl.current && (textareaEl.current.value = defaultValue);
        }
    }, [defaultValue]);

    useEffect(() => {
        if (!textareaEl.current) { return; }

        textareaEl.current.select();
    }, [focusFlag]);

    useLayoutEffect(() => {
        if (!textareaEl.current) { return; }

        const tempRef = textareaEl.current;

        const onRawTextKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                handleRawTextChanged();
            }
        };

        !autoTranslateAfterInput && tempRef.addEventListener('keydown', onRawTextKeyDown);

        return () => { !autoTranslateAfterInput && tempRef.removeEventListener('keydown', onRawTextKeyDown); }
    }, [handleRawTextChanged, autoTranslateAfterInput]);

    return (
        <div className='raw-text'>
            <textarea
                defaultValue={defaultValue}
                placeholder={getMessage('contentInputHere')}
                onChange={onChange}
                onCompositionStart={onCompositionStart}
                onCompositionEnd={onCompositionEnd}
                onKeyDown={e => e.stopPropagation()}
                onKeyUp={e => e.stopPropagation()}
                ref={textareaEl}
                className='raw-text__textarea'
            ></textarea>
        </div>
    );
};

export default RawText;