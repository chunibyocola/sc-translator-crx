import React, { useCallback, useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { mtRequestStart, mtRequestFinish, mtRequestError, mtRemoveSource, mtSetText, mtSetFromAndTo, mtAddSource } from '../../../redux/actions/multipleTranslateActions';
import MtResult from '../../../components/MtResult';
import MtAddSource from '../../../components/MtAddSource';
import LanguageSelection from '../../../components/LanguageSelection';
import RawText from '../../../components/RawText';
import { sendTranslate, sendAudio } from '../../../public/send';
import { mtLangCode } from '../../../constants/langCode';
import './style.css';
import { getMessage } from '../../../public/i18n';
import { addHistory, updateHistoryError, updateHistoryFinish } from '../../../redux/actions/translateHistoryActions';
import { useIsEnable } from '../../../public/react-use';
import { getInsertConfirmed, insertResultToggle } from '../../../public/insert-result';

const MultipleTranslateResult = ({ showRtAndLs, maxHeightGap, autoTranslateAfterInput, enableInsertResult }) => {
    const [resultMaxHeight, setResultMaxHeight] = useState(500);
    const [canInsertResult, setCanInsertResult] = useState(false);

    const translateIdRef = useRef(0);
    const oldTranslateIdRef = useRef(0);
    const resultContainerEle = useRef(null);

    useLayoutEffect(() => {
        const maxHeight = maxHeightGap + resultContainerEle.current.offsetHeight;
        setResultMaxHeight(maxHeight < 40 ? 40 : maxHeight);
    }, [maxHeightGap]);

    const { focusRawText } = useSelector(state => state.resultBoxState);
    const { text, from, to, translations, translateId } = useSelector(state => state.multipleTranslateState);

    const dispatch = useDispatch();

    const isEnableHistory = useIsEnable('history', window.location.host);

    translateIdRef.current = translateId;

    const handleTranslate = useCallback((source) => {
        dispatch(mtRequestStart({ source }));

        sendTranslate(text, { source, from, to, translateId: translateIdRef.current }, (result) => {
            if (result.translateId !== translateIdRef.current) { return; }

            if (result.suc) {
                dispatch(updateHistoryFinish({ translateId: result.translateId, source, result: result.data }));
                dispatch(mtRequestFinish({ source, result: result.data}));
            }
            else {
                dispatch(updateHistoryError({ translateId: result.translateId, source, errorCode: result.data.code }));
                dispatch(mtRequestError({ source, errorCode: result.data.code }));
            }
        });
    }, [text, from, to, dispatch]);

    const handleRemoveSource = useCallback((source) => {
        dispatch(mtRemoveSource({ source }));
    }, [dispatch]);

    const handleSetText = useCallback((text) => {
        text && dispatch(mtSetText({ text }));
    }, [dispatch]);

    const handleSelectionChange = useCallback((from, to) => {
        dispatch(mtSetFromAndTo({ from, to }));
    }, [dispatch]);

    const handleRetry = useCallback((source) => {
        handleTranslate(source);
    }, [handleTranslate]);

    const handleAddSource = useCallback((source, addType) => {
        dispatch(mtAddSource({ source, addType }));
        text && handleTranslate(source);
    }, [dispatch, text, handleTranslate]);

    useEffect(() => {
        if (oldTranslateIdRef.current === translateId) { return; }

        if (text) {
            isEnableHistory && dispatch(addHistory({ translateId, text, sourceList: translations.map(({ source }) => (source)) }));
            translations.map(({ source }) => (handleTranslate(source)));

            // insert result
            setCanInsertResult(enableInsertResult && getInsertConfirmed(text, translateId));
        }

        oldTranslateIdRef.current = translateId;
    }, [translateId, text, handleTranslate, translations, dispatch, isEnableHistory, enableInsertResult]);

    return (
        <>
            <div style={showRtAndLs ? {height: 'auto'} : {height: '0px', overflow: 'hidden'}}>
                <RawText
                    defaultValue={text}
                    rawTextTranslate={handleSetText}
                    focusDependency={focusRawText}
                    autoTranslateAfterInput={autoTranslateAfterInput}
                />
                <LanguageSelection
                    onChange={handleSelectionChange}
                    from={from}
                    to={to}
                    languageCodes={mtLangCode}
                />
            </div>
            <div className='ts-mt-results ts-scrollbar' style={{maxHeight: `${resultMaxHeight}px`}} ref={resultContainerEle}>
                {translations.length === 0 ? 
                    <div className='ts-mt-result-add-translate-source'>{getMessage('sentenceAddTranslateSource')}</div> :
                translations.map(({ source, status, result }) => (
                    <MtResult
                        source={source}
                        status={status}
                        result={result}
                        key={source}
                        text={text}
                        remove={() => handleRemoveSource(source)}
                        readText={(text, from) => sendAudio(text, { source, from })}
                        retry={() => handleRetry(source)}
                        setText={handleSetText}
                        insertResult={canInsertResult ? result => insertResultToggle(translateId, source, result) : undefined}
                    />
                ))}
            </div>
            <MtAddSource translations={translations} addSource={handleAddSource} />
        </>
    );
};

export default MultipleTranslateResult;