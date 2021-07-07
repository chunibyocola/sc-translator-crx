import React, { useCallback, useEffect, useRef } from 'react';
import './style.css';
import RawText from '../../../components/RawText';
import LanguageSelection from '../../../components/LanguageSelection';
import { sendTranslate, sendAudio } from '../../../public/send';
import MtAddSource from '../../../components/MtAddSource';
import MtResult from '../../../components/MtResult';
import { mtLangCode } from '../../../constants/langCode';
import { getMessage } from '../../../public/i18n';
import { getOptions } from '../../../public/options';
import { textPreprocessing } from '../../../public/text-preprocessing';
import { useAppDispatch, useAppSelector } from '../../../public/react-use';
import { mtAddSource, mtRemoveSource, mtRequestError, mtRequestFinish, mtRequestStart, mtSetFromAndTo, mtSetText } from '../../../redux/slice/multipleTranslateSlice';
import { callOutPanel } from '../../../redux/slice/panelStatusSlice';

type MultipleTranslateResultProps = {
    autoTranslateAfterInput: boolean;
};

const MultipleTranslateResult: React.FC<MultipleTranslateResultProps> = ({ autoTranslateAfterInput }) => {
    const { focusFlag } = useAppSelector(state => state.panelStatus);

    const { text, from, to, translations, translateId } = useAppSelector(state => state.multipleTranslate);

    const translateIdRef = useRef(0);
    const oldTranslateIdRef = useRef(0);

    const dispatch = useAppDispatch();

    translateIdRef.current = translateId;

    const handleTranslate = useCallback((source: string) => {
        const preprocessedText = textPreprocessing(text);

        if (!preprocessedText) { return; }

        dispatch(mtRequestStart({ source }));

        sendTranslate(preprocessedText, { source, from, to, translateId: translateIdRef.current }, (result) => {
            if (result.translateId !== translateIdRef.current) { return; }

            result.suc ? dispatch(mtRequestFinish({ source, result: result.data})) : dispatch(mtRequestError({ source, errorCode: result.data.code }));
        });
    }, [text, from, to, dispatch]);

    const handleSetText = useCallback((text: string) => {
        text && dispatch(mtSetText({ text }));
    }, [dispatch]);

    const handleSelectionChange = useCallback((from: string, to: string) => {
        dispatch(mtSetFromAndTo({ from, to }));
    }, [dispatch]);

    const handleRemoveSource = useCallback((source: string) => {
        dispatch(mtRemoveSource({ source }));
    }, [dispatch]);

    const handleRetry = useCallback((source: string) => {
        handleTranslate(source);
    }, [handleTranslate]);

    const handleAddSource = useCallback((source: string, addType: number) => {
        dispatch(mtAddSource({ source, addType }));
        text && handleTranslate(source);
    }, [dispatch, text, handleTranslate]);

    useEffect(() => {
        if (oldTranslateIdRef.current === translateId) { return; }

        text && translations.map(({ source }) => (handleTranslate(source)));

        oldTranslateIdRef.current = translateId;
    }, [translateId, text, handleTranslate, translations, dispatch]);

    useEffect(() => {
        const readClipboardText = async () => {
            const clipboardText = await navigator.clipboard.readText();
            clipboardText && dispatch(mtSetText({ text: clipboardText }));
            dispatch(callOutPanel());
        };

        getOptions().autoPasteInTheInputBox && chrome.permissions.contains({ permissions: ['clipboardRead'] }, result => result && readClipboardText());
    }, [dispatch]);

    return (
        <>
            <RawText
                defaultValue={text}
                rawTextTranslate={handleSetText}
                focusDependency={focusFlag}
                autoTranslateAfterInput={autoTranslateAfterInput}
            />
            <LanguageSelection
                onChange={handleSelectionChange}
                from={from}
                to={to}
                languageCodes={mtLangCode}
            />
            <div className='ts-mt-results ts-scrollbar'>
                {translations.length === 0 ? 
                    <div className='ts-mt-result-add-translate-source'>{getMessage('sentenceAddTranslateSource')}</div> :
                translations.map(({ source, translateRequest }) => (
                    <MtResult
                        source={source}
                        transalteRequest={translateRequest}
                        key={source}
                        remove={() => handleRemoveSource(source)}
                        readText={(text, from) => sendAudio(text, { source, from })}
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