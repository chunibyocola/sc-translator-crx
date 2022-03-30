import React, { useEffect, useCallback, useRef, useLayoutEffect, useState } from 'react';
import { sendTranslate } from '../../../public/send';
import TsResult from '../../../components/TsResult';
import LanguageSelection from '../../../components/LanguageSelection';
import RawText from '../../../components/RawText';
import { googleLangCode, langCode } from '../../../constants/langCode';
import TsVia from '../../../components/TsVia';
import { switchTranslateSource } from '../../../public/switch-translate-source';
import { useAppDispatch, useAppSelector, useInsertResult, useIsHistoryEnabled } from '../../../public/react-use';
import './style.css';
import { textPreprocessing } from '../../../public/text-preprocessing';
import { stRequestError, stRequestFinish, stRequestStart, stSetFromAndTo, stSetSourceFromTo, stSetText } from '../../../redux/slice/singleTranslateSlice';
import { addHistory, updateHistoryError, updateHistoryFinish } from '../../../redux/slice/translateHistorySlice';

type SingleTranslateResultProps = {
    maxHeightGap: number;
    autoTranslateAfterInput: boolean;
};

const SingleTranslateResult: React.FC<SingleTranslateResultProps> = ({ maxHeightGap, autoTranslateAfterInput }) => {
    const [resultMaxHeight, setResultMaxHeight] = useState(500);

    const [canInsertResult, confirmInsertResult, insertResultToggle, autoInsertResult] = useInsertResult();

    const { text, source, from, to, translateRequest, translateId } = useAppSelector(state => state.singleTranslate);

    const { focusFlag, displayEditArea } = useAppSelector(state => state.panelStatus);

    const translateIdRef = useRef(0);
    const oldTranslateIdRef = useRef(0);
    const resultContainerEle = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!resultContainerEle.current) { return; }

        const maxHeight = maxHeightGap + resultContainerEle.current.offsetHeight;
        setResultMaxHeight(maxHeight < 40 ? 40 : maxHeight);
    }, [maxHeightGap]);

    const dispatch = useAppDispatch();

    const historyEnabled = useIsHistoryEnabled(window.location.host);

    translateIdRef.current = translateId;

    const handleTranslate = useCallback(() => {
        const preprocessedText = textPreprocessing(text);

        if (!preprocessedText) { return; }

        dispatch(stRequestStart());

        sendTranslate({ text: preprocessedText, source, from, to }, translateIdRef.current).then((response) => {
            if (response.translateId !== translateIdRef.current) { return; }

            if (!('code' in response)) {
                dispatch(updateHistoryFinish({ translateId: response.translateId, source, result: response.translation }));
                dispatch(stRequestFinish({ result: response.translation }));
                autoInsertResult(response.translateId, source, response.translation.result);
            }
            else {
                dispatch(updateHistoryError({ translateId: response.translateId, source, errorCode: response.code }));
                dispatch(stRequestError({ errorCode: response.code }));
            }
        });
    }, [dispatch, text, source, from, to, autoInsertResult]);

    const handleSourceChange = useCallback((targetSource: string) => {
        dispatch(stSetSourceFromTo(switchTranslateSource(targetSource, { source, from, to })));
    }, [dispatch, source, from, to]);

    const handleSelectionChange = useCallback((from: string, to: string) => {
        dispatch(stSetFromAndTo({ from, to }));
    }, [dispatch]);

    const handleSetText = useCallback((text: string) => {
        text && dispatch(stSetText({ text }));
    }, [dispatch]);

    const handleRetry = useCallback(() => {
        handleTranslate();
    }, [handleTranslate]);

    useEffect(() => {
        if (oldTranslateIdRef.current === translateId) { return; }

        if (text) {
            historyEnabled && dispatch(addHistory({ translateId, text, sourceList: [source] }));
            handleTranslate();

            // insert result
            confirmInsertResult(text, translateId);
        }

        oldTranslateIdRef.current = translateId;
    }, [text, handleTranslate, dispatch, translateId, source, historyEnabled, confirmInsertResult]);

    return (
        <>
            <div style={displayEditArea ? {height: 'auto'} : {height: '0px', overflow: 'hidden'}}>
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
                    languageCodes={langCode[source] ?? googleLangCode}
                />
            </div>
            <div className='single-result scrollbar' style={{maxHeight: `${resultMaxHeight}px`}} ref={resultContainerEle}>
                <TsResult
                    translateRequest={translateRequest}
                    source={source}
                    retry={handleRetry}
                    setText={handleSetText}
                    insertResult={canInsertResult ? result => insertResultToggle(translateId, source, result) : undefined}
                />
            </div>
            <TsVia
                sourceChange={handleSourceChange}
                source={source}
            />
        </>
    );
};

export default SingleTranslateResult;