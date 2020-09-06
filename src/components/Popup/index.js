import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LanguageSelection from '../LanguageSelection';
import { sendAudio, sendTranslate } from '../../public/send';
import RawText from '../RawText';
import TsResult from '../TsResult';
import { useOptions } from '../../public/react-use';
import './style.css';
import PopupHeader from '../PopupHeader';
import { langCode } from '../../constants/langCode';
import { stRequestFinish, stRequestStart, stRequestError, stSetSource, stSetFromAndTo, stSetText } from '../../redux/actions/singleTranslateActions';

const Popup = () => {
    const { darkMode } = useOptions(['darkMode']);

    const { status, result, source, from, to, text } = useSelector(state => state.singleTranslateState);
    const { requesting, requestEnd } = status;

    const dispatch = useDispatch();

    const handleTranslate = useCallback(() => {
        dispatch(stRequestStart());

        sendTranslate(text, { source, from, to }, (result) => {
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

    useEffect(() => {
        !requestEnd && !requesting && text && handleTranslate();
    }, [requestEnd, requesting, text, handleTranslate]);

    return (
        <div id="sc-translator-root" className={`container ${darkMode ? 'dark' : 'light'}`}>
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
                    sourceChange={handleSourceChange}
                    readText={handleReadText}
                    source={source}
                />
            </div>
        </div>
    )
};

export default Popup;