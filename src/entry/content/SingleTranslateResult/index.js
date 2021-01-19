import React, { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendTranslate, sendAudio } from '../../../public/send';
import TsResult from '../../../components/TsResult';
import LanguageSelection from '../../../components/LanguageSelection';
import RawText from '../../../components/RawText';
import { langCode } from '../../../constants/langCode';
import {
    stRequestStart,
    stSetFromAndTo,
    stSetText,
    stRequestFinish,
    stRequestError,
    stSetSourceFromTo
} from '../../../redux/actions/singleTranslateActions';
import TsVia from '../../../components/TsVia';
import { switchTranslateSource } from '../../../public/switch-translate-source';
import { addHistory, updateHistoryError, updateHistoryFinish } from '../../../redux/actions/translateHistoryActions';
import { useIsEnable } from '../../../public/react-use';

const SingleTranslateResult = ({ showRtAndLs }) => {
    const { text, source, from, to, status, result, translateId } = useSelector(state => state.singleTranslateState);

    const { focusRawText } = useSelector(state => state.resultBoxState);

    const translateIdRef = useRef(0);
    const oldTranslateIdRef = useRef(0);

    const dispatch = useDispatch();

    const isEnableHistory = useIsEnable('history', window.location.host);

    translateIdRef.current = translateId;

    const handleTranslate = useCallback(() => {
        dispatch(stRequestStart());

        sendTranslate(text, { source, from, to, translateId: translateIdRef.current }, (result) => {
            if (result.translateId !== translateIdRef.current) { return; }

            if (result.suc) {
                dispatch(updateHistoryFinish({ translateId: result.translateId, source, result: result.data }));
                dispatch(stRequestFinish({ result: result.data }));
            }
            else {
                dispatch(updateHistoryError({ translateId: result.translateId, source, errorCode: result.data.code }));
                dispatch(stRequestError({ errorCode: result.data.code }));
            }
        });

    }, [dispatch, text, source, from, to]);

    const handleSourceChange = useCallback((targetSource) => {
        dispatch(stSetSourceFromTo(switchTranslateSource(targetSource, { source, from, to })));
    }, [dispatch, source, from, to]);

    const handleSelectionChange = useCallback((from, to) => {
        dispatch(stSetFromAndTo({ from, to }));
    }, [dispatch]);

    const handleRawTextChange = useCallback((text) => {
        text && dispatch(stSetText({ text }));
    }, [dispatch]);

    const handleReadText = useCallback((text, { source, from }) => {
        text && sendAudio(text, { source, from });
    }, []);

    const handleRetry = useCallback(() => {
        handleTranslate();
    }, [handleTranslate]);

    useEffect(() => {
        if (oldTranslateIdRef.current === translateId) { return; }

        if (text) {
            isEnableHistory && dispatch(addHistory({ translateId, text, sourceList: [source] }));
            handleTranslate();
        }

        oldTranslateIdRef.current = translateId;
    }, [text, handleTranslate, dispatch, translateId, source, isEnableHistory]);

    return (
        <>
            <div style={{display: showRtAndLs ? 'block' : 'none'}}>
                <RawText
                    defaultValue={text}
                    rawTextTranslate={handleRawTextChange}
                    focusDependency={focusRawText}
                />
                <LanguageSelection
                    selectionChange={handleSelectionChange}
                    from={from}
                    to={to}
                    options={langCode[source]}
                />
            </div>
            <TsResult
                resultObj={result}
                status={status}
                readText={handleReadText}
                source={source}
                retry={handleRetry}
            />
            <TsVia
                sourceChange={handleSourceChange}
                source={source}
            />
        </>
    );
};

export default SingleTranslateResult;