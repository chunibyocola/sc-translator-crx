import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LanguageSelection from '../LanguageSelection';
import { translationUpdate } from '../../redux/actions/translationActions';
import {
    startRequest,
    finishRequest,
    errorRequest
} from '../../redux/actions/tsResultActions';
import { sendAudio, sendTranslate } from '../../public/send';
import RawText from '../RawText';
import TsResult from '../TsResult';
import { useOptions } from '../../public/react-use';
import './style.css';
import PopupHeader from '../PopupHeader';
import { translationSetFromAndTo } from '../../redux/actions/translationActions';
import { langCode } from '../../constants/langCode';

const Popup = () => {
    const { darkMode } = useOptions(['darkMode']);

    const {
        requestEnd,
        requesting,
        err,
        errCode,
        resultObj
    } = useSelector(state => state.tsResultState);

    const translationState = useSelector(state => state.translationState);

    const dispatch = useDispatch();

    const handleTranslate = useCallback((text, translation) => {
        dispatch(startRequest());

        sendTranslate(text, translation, (result) => {
            if (result.suc) dispatch(finishRequest(result.data));
            else dispatch(errorRequest(result.data.code));
        })
    }, [dispatch]);

    const handleSourceChange = useCallback((source) => {
        if (source !== translationState.source) {
            dispatch(translationUpdate(source, '', ''));
            if (resultObj.text) {
                handleTranslate(resultObj.text, { source, from: '', to: '' });
            }
        }
    }, [dispatch, translationState, resultObj.text, handleTranslate]);

    const handleReadText = useCallback((text, { source, from }) => {
        sendAudio(text, { source, from });
    }, []);

    const handleRawTextTranslate = useCallback((text) => {
        handleTranslate(text, translationState);
    }, [handleTranslate, translationState]);

    const handleSelectionChange = useCallback((from, to) => {
        dispatch(translationSetFromAndTo(from, to));
        if (resultObj.text) {
            handleTranslate(resultObj.text, { ...translationState, from, to });
        }
    }, [resultObj.text, translationState, handleTranslate, dispatch]);

    return (
        <div id="sc-translator-root" className={`container ${darkMode ? 'dark' : 'light'}`}>
            <PopupHeader />
            <div className="content">
                <RawText
                    rawTextTranslate={handleRawTextTranslate}
                />
                <LanguageSelection
                    selectionChange={handleSelectionChange}
                    from={translationState.from}
                    to={translationState.to}
                    options={langCode[translationState.source]}
                />
                <TsResult
                    resultObj={resultObj}
                    status={{requestEnd, requesting, err, errCode}}
                    sourceChange={handleSourceChange}
                    readText={handleReadText}
                    source={translationState.source}
                />
            </div>
        </div>
    )
};

export default Popup;