import React, { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendTranslate, sendAudio } from '../../../public/send';
import TsResult from '../../../components/TsResult';
import LanguageSelection from '../../../components/LanguageSelection';
import RawText from '../../../components/RawText';
import { langCode } from '../../../constants/langCode';
import {
    stRequestStart,
    stAddHistory,
    stSetFromAndTo,
    stSetText,
    stRequestFinish,
    stRequestError,
    stRetry,
    stSetSourceFromTo
} from '../../../redux/actions/singleTranslateActions';
import TsVia from '../../../components/TsVia';
import { switchTranslateSource } from '../../../public/switch-translate-source';

const SingleTranslateResult = ({ showRtAndLs }) => {
    const { text, source, from, to, status, result, history, resultFromHistory, translateId } = useSelector(state => state.singleTranslateState);
    const { requesting, requestEnd } = status;

    const { focusRawText } = useSelector(state => state.resultBoxState);

    const translateIdRef = useRef(0);

    const dispatch = useDispatch();

    translateIdRef.current = translateId;

    const handleGetHistory = useCallback((text, source, from, to) => history.find(v => (
        v.text === text &&
        v.translation.source === source &&
        v.translation.from === from &&
        v.translation.to === to
    )), [history]);

    const handleTranslate = useCallback(() => {
        const tempResult = handleGetHistory(text, source, from, to);
        if (tempResult) {
            dispatch(stRequestFinish({ result: tempResult }));
            return;
        }

        dispatch(stRequestStart());

        sendTranslate(text, { source, from, to, translateId: translateIdRef.current }, (result) => {
            if (result.translateId !== translateIdRef.current) { return; }

            if (result.suc) {
                dispatch(stAddHistory({ result: { ...result.data, translation: { source, from, to } } }));
                dispatch(stRequestFinish({ result: result.data }));
            }
            else dispatch(stRequestError({ errorCode: result.data.code }));
        });

    }, [dispatch, text, source, from, to, handleGetHistory]);

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
        dispatch(stRetry());
    }, [dispatch]);

    useEffect(() => {
        !requestEnd && !requesting && !resultFromHistory && text && handleTranslate();
    }, [requestEnd, requesting, resultFromHistory, text, handleTranslate]);

    return (
        <>
            <div style={{display: (showRtAndLs && !resultFromHistory) ? 'block' : 'none'}}>
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
                    disableSelect={resultFromHistory}
                />
            </div>
            <TsResult
                resultObj={result}
                status={status}
                readText={handleReadText}
                source={resultFromHistory ? result.translation.source : source}
                retry={handleRetry}
            />
            <TsVia
                sourceChange={handleSourceChange}
                source={resultFromHistory ? result.translation.source : source}
                disableSourceChange={resultFromHistory}
            />
        </>
    );
};

export default SingleTranslateResult;