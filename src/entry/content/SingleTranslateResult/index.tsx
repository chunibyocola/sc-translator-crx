import React, { useEffect, useCallback, useRef, useLayoutEffect, useState } from 'react';
import { sendTranslate } from '../../../public/send';
import TsResult from '../../../components/TsResult';
import LanguageSelection from '../../../components/LanguageSelection';
import RawText from '../../../components/RawText';
import { langCode } from '../../../constants/langCode';
import TsVia from '../../../components/TsVia';
import { switchTranslateSource } from '../../../public/switch-translate-source';
import { useAppDispatch, useAppSelector, useInsertResult, useIsEnable } from '../../../public/react-use';
import './style.css';
import { textPreprocessing } from '../../../public/text-preprocessing';
import { stRequestError, stRequestFinish, stRequestStart, stSetFromAndTo, stSetSourceFromTo, stSetText } from '../../../redux/slice/singleTranslateSlice';
import { addHistory, updateHistoryError, updateHistoryFinish } from '../../../redux/slice/translateHistorySlice';
import { playAudio } from '../../../public/play-audio';

type SingleTranslateResultProps = {
    showRtAndLs: boolean;
    maxHeightGap: number;
    autoTranslateAfterInput: boolean;
};

const SingleTranslateResult: React.FC<SingleTranslateResultProps> = ({ showRtAndLs, maxHeightGap, autoTranslateAfterInput }) => {
    const [resultMaxHeight, setResultMaxHeight] = useState(500);

    const [canInsertResult, confirmInsertResult, insertResultToggle, autoInsertResult] = useInsertResult();

    const { text, source, from, to, translateRequest, translateId } = useAppSelector(state => state.singleTranslate);

    const { focusFlag } = useAppSelector(state => state.panelStatus);

    const translateIdRef = useRef(0);
    const oldTranslateIdRef = useRef(0);
    const resultContainerEle = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!resultContainerEle.current) { return; }

        const maxHeight = maxHeightGap + resultContainerEle.current.offsetHeight;
        setResultMaxHeight(maxHeight < 40 ? 40 : maxHeight);
    }, [maxHeightGap]);

    const dispatch = useAppDispatch();

    const isEnableHistory = useIsEnable('history', window.location.host);

    translateIdRef.current = translateId;

    const handleTranslate = useCallback(() => {
        const preprocessedText = textPreprocessing(text);

        if (!preprocessedText) { return; }

        dispatch(stRequestStart());

        sendTranslate(preprocessedText, { source, from, to, translateId: translateIdRef.current }, (result) => {
            if (result.translateId !== translateIdRef.current) { return; }

            if (result.suc) {
                dispatch(updateHistoryFinish({ translateId: result.translateId, source, result: result.data }));
                dispatch(stRequestFinish({ result: result.data }));
                autoInsertResult(result.translateId, source, result.data.result);
            }
            else {
                dispatch(updateHistoryError({ translateId: result.translateId, source, errorCode: result.data.code }));
                dispatch(stRequestError({ errorCode: result.data.code }));
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

    const handleReadText = useCallback((text: string, from: string) => {
        text && playAudio({ text, source, from });
    }, [source]);

    const handleRetry = useCallback(() => {
        handleTranslate();
    }, [handleTranslate]);

    useEffect(() => {
        if (oldTranslateIdRef.current === translateId) { return; }

        if (text) {
            isEnableHistory && dispatch(addHistory({ translateId, text, sourceList: [source] }));
            handleTranslate();

            // insert result
            confirmInsertResult(text, translateId);
        }

        oldTranslateIdRef.current = translateId;
    }, [text, handleTranslate, dispatch, translateId, source, isEnableHistory, confirmInsertResult]);

    return (
        <>
            <div style={showRtAndLs ? {height: 'auto'} : {height: '0px', overflow: 'hidden'}}>
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
                    languageCodes={langCode[source]}
                />
            </div>
            <div className='single-result scrollbar' style={{maxHeight: `${resultMaxHeight}px`}} ref={resultContainerEle}>
                <TsResult
                    translateRequest={translateRequest}
                    readText={handleReadText}
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