import React, { useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { getMessage } from '../../public/i18n';
import { useAppSelector, useDebounceFn, useOptions } from '../../public/react-use';
import { textPreprocessing } from '../../public/text-preprocessing';
import { GetStorageKeys } from '../../types';
import './style.css';

type RawTextProps = {
    defaultValue: string;
    rawTextTranslate: (text: string) => void;
};

const useOptionsDependency: GetStorageKeys<'autoTranslateAfterInput'> = ['autoTranslateAfterInput'];

const RawText: React.FC<RawTextProps> = ({ defaultValue, rawTextTranslate }) => {
    const { autoTranslateAfterInput } = useOptions(useOptionsDependency);
    const { focusFlag } = useAppSelector(state => state.panelStatus);

    const lastTextRef = useRef('');
    const textareaEl = useRef<HTMLTextAreaElement>(null);
    const compositionStatus = useRef(false);

    const handleRawTextChanged = useCallback(() => {
        if (!textareaEl.current) { return; }

        let text = textareaEl.current.value.trimStart();

        if (!text || text.trimEnd() === lastTextRef.current || !textPreprocessing(text)) { return; }

        lastTextRef.current = text.trimEnd();

        rawTextTranslate(text);
    }, [rawTextTranslate]);

    const debounceRawTextChanged = useDebounceFn(handleRawTextChanged, 600, [handleRawTextChanged]);

    const onCompositionStart = useCallback(() => {
        compositionStatus.current = true;
    }, []);

    const onCompositionEnd = useCallback(() => {
        compositionStatus.current = false;
        autoTranslateAfterInput && debounceRawTextChanged();
    }, [debounceRawTextChanged, autoTranslateAfterInput]);

    const onChange = useCallback(() => {
        autoTranslateAfterInput && !compositionStatus.current && debounceRawTextChanged();
    }, [debounceRawTextChanged, autoTranslateAfterInput]);

    useEffect(() => {
        if (defaultValue) {
            lastTextRef.current = defaultValue.trimEnd();
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