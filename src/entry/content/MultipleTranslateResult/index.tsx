import React, { useCallback, useRef, useEffect, useState, useLayoutEffect } from 'react';
import MtResult from '../../../components/MtResult';
import MtAddSource from '../../../components/MtAddSource';
import LanguageSelection from '../../../components/LanguageSelection';
import RawText from '../../../components/RawText';
import { sendTranslate } from '../../../public/send';
import { mtLangCode } from '../../../constants/langCode';
import './style.css';
import { getMessage } from '../../../public/i18n';
import { useAppDispatch, useAppSelector, useInsertResult, useIsHistoryEnabled } from '../../../public/react-use';
import { textPreprocessing } from '../../../public/text-preprocessing';
import { addHistory, updateHistoryError, updateHistoryFinish } from '../../../redux/slice/translateHistorySlice';
import { addSource, nextTranslaion, removeSource, requestError, requestFinish, requestStart } from '../../../redux/slice/translationSlice';

type MultipleTranslateResultProps = {
    maxHeightGap: number;
};

const MultipleTranslateResult: React.FC<MultipleTranslateResultProps> = React.memo(({ maxHeightGap }) => {
    const [resultMaxHeight, setResultMaxHeight] = useState(500);

    const [canInsertResult, confirmInsertResult, insertResultToggle, autoInsertResult] = useInsertResult();

    const translateIdRef = useRef(0);
    const oldTranslateIdRef = useRef(0);
    const resultContainerEle = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!resultContainerEle.current) { return; }

        const maxHeight = maxHeightGap + resultContainerEle.current.offsetHeight;
        setResultMaxHeight(maxHeight < 40 ? 40 : maxHeight);
    }, [maxHeightGap]);

    const { displayEditArea } = useAppSelector(state => state.panelStatus);
    const { text, from, to, translations, translateId } = useAppSelector(state => state.translation);

    const dispatch = useAppDispatch();

    const historyEnabled = useIsHistoryEnabled(window.location.host);

    translateIdRef.current = translateId;

    const handleTranslate = useCallback((source: string) => {
        const preprocessedText = textPreprocessing(text);

        if (!preprocessedText) { return; }

        dispatch(requestStart({ source }));

        sendTranslate({ text: preprocessedText, source, from, to }, translateIdRef.current).then((response) => {
            if (response.translateId !== translateIdRef.current) { return; }

            if (!('code' in response)) {
                dispatch(updateHistoryFinish({ translateId: response.translateId, source, result: response.translation }));
                dispatch(requestFinish({ source, result: response.translation}));
                autoInsertResult(response.translateId, source, response.translation.result);
            }
            else {
                dispatch(updateHistoryError({ translateId: response.translateId, source, errorCode: response.code }));
                dispatch(requestError({ source, errorCode: response.code }));
            }
        });
    }, [text, from, to, dispatch, autoInsertResult]);

    const handleRemoveSource = useCallback((source: string) => {
        dispatch(removeSource({ source }));
    }, [dispatch]);

    const handleSetText = useCallback((text: string) => {
        text && dispatch(nextTranslaion({ text }));
    }, [dispatch]);

    const handleSelectionChange = useCallback((from: string, to: string) => {
        dispatch(nextTranslaion({ from, to }));
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

        if (text) {
            historyEnabled && dispatch(addHistory({ translateId, text, sourceList: translations.map(({ source }) => (source)) }));
            translations.map(({ source }) => (handleTranslate(source)));

            // insert result
            confirmInsertResult(text, translateId);
        }

        oldTranslateIdRef.current = translateId;
    }, [translateId, text, handleTranslate, translations, dispatch, historyEnabled, confirmInsertResult]);

    return (
        <>
            <div style={displayEditArea ? {height: 'auto'} : {height: '0px', overflow: 'hidden'}}>
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
            </div>
            <div className='multiple-result scrollbar' style={{maxHeight: `${resultMaxHeight}px`}} ref={resultContainerEle}>
                {translations.length === 0 ? 
                    <div className='multiple-result__add-source'>{getMessage('sentenceAddTranslateSource')}</div> :
                translations.map(({ source, translateRequest }) => (
                    <MtResult
                        source={source}
                        translateRequest={translateRequest}
                        key={source}
                        remove={() => handleRemoveSource(source)}
                        retry={() => handleRetry(source)}
                        setText={handleSetText}
                        insertResult={canInsertResult ? result => insertResultToggle(translateId, source, result) : undefined}
                    />
                ))}
            </div>
            <MtAddSource translations={translations} addSource={handleAddSource} />
        </>
    );
});

export default MultipleTranslateResult;