import React, { useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LanguageSelection from '../../../components/LanguageSelection';
import { sendAudio, sendTranslate } from '../../../public/send';
import RawText from '../../../components/RawText';
import TsResult from '../../../components/TsResult';
import { langCode } from '../../../constants/langCode';
import { stRequestFinish, stRequestStart, stRequestError, stSetFromAndTo, stSetText, stSetSourceFromTo } from '../../../redux/actions/singleTranslateActions';
import TsVia from '../../../components/TsVia';
import { switchTranslateSource } from '../../../public/switch-translate-source';

const SingleTranslateResult = () => {
    const { focusRawText } = useSelector(state => state.resultBoxState);

    const { status, result, source, from, to, text, translateId } = useSelector(state => state.singleTranslateState);
    const { requesting, requestEnd } = status;

    const translateIdRef = useRef(0);
    const oldTranslateIdRef = useRef(0);

    translateIdRef.current = translateId;

    const dispatch = useDispatch();

    const handleTranslate = useCallback(() => {
        dispatch(stRequestStart());

        sendTranslate(text, { source, from, to, translateId: translateIdRef.current }, (result) => {
            if (result.translateId !== translateIdRef.current) { return; }

            result.suc ? dispatch(stRequestFinish({ result: result.data })) : dispatch(stRequestError({ errorCode: result.data.code }));
        });
    }, [dispatch, text, source, from, to]);

    const handleRawTextTranslate = useCallback((text) => {
        text && dispatch(stSetText({ text }));
    }, [dispatch]);

    const handleReadText = useCallback((text, { source, from }) => {
        sendAudio(text, { source, from });
    }, []);

    const handleSourceChange = useCallback((targetSource) => {
        dispatch(stSetSourceFromTo(switchTranslateSource(targetSource, { source, from, to })));
    }, [dispatch, source, from, to]);

    const handleSelectionChange = useCallback((from, to) => {
        dispatch(stSetFromAndTo({ from, to }));
    }, [dispatch]);

    const handleRetry = useCallback(() => {
        handleTranslate();
    }, [handleTranslate]);

    useEffect(() => {
        if (oldTranslateIdRef.current === translateId) { return; }

        text && handleTranslate();

        oldTranslateIdRef.current = translateId;
    }, [requestEnd, requesting, text, handleTranslate, translateId]);

    return (
        <>
            <RawText
                defaultValue={text}
                rawTextTranslate={handleRawTextTranslate}
                focusDependency={focusRawText}
            />
            <LanguageSelection
                selectionChange={handleSelectionChange}
                from={from}
                to={to}
                options={langCode[source]}
            />
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