import React, { useCallback, useEffect, useRef } from 'react';
import LanguageSelection from '../../../components/LanguageSelection';
import { sendTranslate } from '../../../public/send';
import RawText from '../../../components/RawText';
import TsResult from '../../../components/TsResult';
import { googleLangCode, langCode } from '../../../constants/langCode';
import TsVia from '../../../components/TsVia';
import { switchTranslateSource } from '../../../public/switch-translate-source';
import { getOptions } from '../../../public/options';
import { textPreprocessing } from '../../../public/text-preprocessing';
import { useAppDispatch, useAppSelector } from '../../../public/react-use';
import { stRequestError, stRequestFinish, stRequestStart, stSetFromAndTo, stSetSourceFromTo, stSetText } from '../../../redux/slice/singleTranslateSlice';
import { callOutPanel } from '../../../redux/slice/panelStatusSlice';

const SingleTranslateResult: React.FC = () => {
    const { translateRequest, source, from, to, text, translateId } = useAppSelector(state => state.singleTranslate);

    const translateIdRef = useRef(0);
    const oldTranslateIdRef = useRef(0);

    translateIdRef.current = translateId;

    const dispatch = useAppDispatch();

    const handleTranslate = useCallback(() => {
        const preprocessedText = textPreprocessing(text);

        if (!preprocessedText) { return; }

        dispatch(stRequestStart());

        sendTranslate({ text: preprocessedText, source, from, to }, translateIdRef.current).then((response) => {
            if (response.translateId !== translateIdRef.current) { return; }

            !('code' in response) ? dispatch(stRequestFinish({ result: response.translation })) : dispatch(stRequestError({ errorCode: response.code }));
        });
    }, [dispatch, text, source, from, to]);

    const handleSetText = useCallback((text: string) => {
        text && dispatch(stSetText({ text }));
    }, [dispatch]);

    const handleSourceChange = useCallback((targetSource: string) => {
        dispatch(stSetSourceFromTo(switchTranslateSource(targetSource, { source, from, to })));
    }, [dispatch, source, from, to]);

    const handleSelectionChange = useCallback((from: string, to: string) => {
        dispatch(stSetFromAndTo({ from, to }));
    }, [dispatch]);

    const handleRetry = useCallback(() => {
        handleTranslate();
    }, [handleTranslate]);

    useEffect(() => {
        if (oldTranslateIdRef.current === translateId) { return; }

        text && handleTranslate();

        oldTranslateIdRef.current = translateId;
    }, [text, handleTranslate, translateId]);

    useEffect(() => {
        const readClipboardText = async () => {
            const clipboardText = await navigator.clipboard.readText();
            clipboardText && dispatch(stSetText({ text: clipboardText }));
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
                languageCodes={langCode[source] ?? googleLangCode}
            />
            <div style={{minHeight: '250px'}}>
                <div className='scrollbar' style={{maxHeight: '300px', overflowY: 'auto'}}>
                    <TsResult
                        translateRequest={translateRequest}
                        source={source}
                        retry={handleRetry}
                        setText={handleSetText}
                    />
                </div>
                <TsVia
                    sourceChange={handleSourceChange}
                    source={source}
                />
            </div>
        </>
    );
};

export default SingleTranslateResult;