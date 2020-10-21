import React, { useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LanguageSelection from '../LanguageSelection';
import { sendAudio, sendTranslate } from '../../public/send';
import RawText from '../RawText';
import TsResult from '../TsResult';
import './style.css';
import PopupHeader from '../PopupHeader';
import { langCode } from '../../constants/langCode';
import { stRequestFinish, stRequestStart, stRequestError, stSetSource, stSetFromAndTo, stSetText, stRetry } from '../../redux/actions/singleTranslateActions';
import TsVia from '../TsVia';

const Popup = () => {
    const { status, result, source, from, to, text, translateId } = useSelector(state => state.singleTranslateState);
    const { requesting, requestEnd } = status;

    const translateIdRef = useRef(0);

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

    const handleSourceChange = useCallback((source) => {
        dispatch(stSetSource({ source }));
    }, [dispatch]);

    const handleSelectionChange = useCallback((from, to) => {
        dispatch(stSetFromAndTo({ from, to }));
    }, [dispatch]);

    const handleRetry = useCallback(() => {
        dispatch(stRetry());
    }, [dispatch]);

    useEffect(() => {
        !requestEnd && !requesting && text && handleTranslate();
    }, [requestEnd, requesting, text, handleTranslate]);

    return (
        <div id="sc-translator-root" className='container'>
            <PopupHeader />
            <div className="content">
                <RawText
                    rawTextTranslate={handleRawTextTranslate}
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
            </div>
        </div>
    )
};

export default Popup;