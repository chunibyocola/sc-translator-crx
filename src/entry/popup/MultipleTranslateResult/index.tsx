import React, { useCallback, useEffect, useRef } from 'react';
import './style.css';
import RawText from '../../../components/RawText';
import LanguageSelection from '../../../components/LanguageSelection';
import { sendTranslate } from '../../../public/send';
import MtAddSource from '../../../components/MtAddSource';
import MtResult from '../../../components/MtResult';
import { mtLangCode } from '../../../constants/langCode';
import { getMessage } from '../../../public/i18n';
import { getOptions } from '../../../public/options';
import { textPreprocessing } from '../../../public/text-preprocessing';
import { useAppDispatch, useAppSelector } from '../../../public/react-use';
import { callOutPanel } from '../../../redux/slice/panelStatusSlice';
import { addSource, nextTranslaion, removeSource, requestError, requestFinish, requestStart } from '../../../redux/slice/translationSlice';

const MultipleTranslateResult: React.FC = () => {
    const { text, from, to, translations, translateId } = useAppSelector(state => state.translation);

    const translateIdRef = useRef(0);
    const oldTranslateIdRef = useRef(0);

    const dispatch = useAppDispatch();

    translateIdRef.current = translateId;

    const handleTranslate = useCallback((source: string) => {
        const preprocessedText = textPreprocessing(text);

        if (!preprocessedText) { return; }

        dispatch(requestStart({ source }));

        sendTranslate({ text: preprocessedText, source, from, to }, translateIdRef.current).then((response) => {
            if (response.translateId !== translateIdRef.current) { return; }

            !('code' in response) ? dispatch(requestFinish({ source, result: response.translation})) : dispatch(requestError({ source, errorCode: response.code }));
        });
    }, [text, from, to, dispatch]);

    const handleSetText = useCallback((text: string) => {
        text && dispatch(nextTranslaion({ text }));
    }, [dispatch]);

    const handleSelectionChange = useCallback((from: string, to: string) => {
        dispatch(nextTranslaion({ from, to }));
    }, [dispatch]);

    const handleRemoveSource = useCallback((source: string) => {
        dispatch(removeSource({ source }));
    }, [dispatch]);

    const handleRetry = useCallback((source: string) => {
        handleTranslate(source);
    }, [handleTranslate]);

    const handleAddSource = useCallback((source: string, addType: number) => {
        dispatch(addSource({ source, addType }));
        text && handleTranslate(source);
    }, [dispatch, text, handleTranslate]);

    useEffect(() => {
        if (oldTranslateIdRef.current === translateId) { return; }

        text && translations.map(({ source }) => (handleTranslate(source)));

        oldTranslateIdRef.current = translateId;
    }, [translateId, text, handleTranslate, translations]);

    useEffect(() => {
        const readClipboardText = async () => {
            const clipboardText = await navigator.clipboard.readText();
            clipboardText && dispatch(nextTranslaion({ text: clipboardText }));
            dispatch(callOutPanel());
        };

        getOptions().autoPasteInTheInputBox && readClipboardText();
    }, [dispatch]);

    return (
        <>
            <RawText
                defaultValue={text}
                rawTextTranslate={handleSetText}
            />
            <LanguageSelection
                onChange={handleSelectionChange}
                from={from}
                to={to}
                languageCodes={mtLangCode}
            />
            <div className='popup-multiple-result scrollbar'>
                {translations.length === 0 ? 
                    <div className='popup-multiple-result__add-source'>{getMessage('sentenceAddTranslateSource')}</div> :
                translations.map(({ source, translateRequest }) => (
                    <MtResult
                        source={source}
                        translateRequest={translateRequest}
                        key={source}
                        remove={() => handleRemoveSource(source)}
                        retry={() => handleRetry(source)}
                        setText={handleSetText}
                    />
                ))}
            </div>
            <MtAddSource translations={translations} addSource={handleAddSource} />
        </>
    );
};

export default MultipleTranslateResult;