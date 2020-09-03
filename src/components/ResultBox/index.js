import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    startRequest,
    finishRequest,
    requestTsResultWithText,
    errorRequest
} from '../../redux/actions/tsResultActions';
import { setResultBoxShowAndPosition } from '../../redux/actions/resultBoxActions';
import { addHistory } from '../../redux/actions/tsHistoryActions';
import { translationUpdate, translationSetFromAndTo } from '../../redux/actions/translationActions';
import { sendTranslate, sendAudio } from '../../public/send';
import TsResult from '../TsResult';
import LanguageSelection from '../LanguageSelection';
import RawText from '../RawText';
import { getI18nMessage } from '../../public/chrome-call';
import IconFont from '../IconFont';
import './style.css';
import { langCode } from '../../constants/langCode';
import { drag, calculatePosition } from '../../public/utils';

const initPos = { x: 0, y: 0 };

const ResultBox = () => {
    const {
        requestEnd,
        requesting,
        err,
        errCode,
        resultObj,
        withResultObj,
        text
    } = useSelector(state => state.tsResultState);

    const { show, pos } = useSelector(state => state.resultBoxState);
    const tsHistoryState = useSelector(state => state.tsHistoryState);
    const translationState = useSelector(state => state.translationState);
    
    const [pinning, setPinning] = useState(false);
    const [pinPos, setPinPos] = useState(initPos);
    const [showRtAndLs, setShowRtAndLs] = useState(false); 

    const pinPosRef = useRef(initPos);
    const rbEle = useRef(null);

    const dispatch = useDispatch();

    const pinningToggle = useCallback(() => {
        pinning && dispatch(setResultBoxShowAndPosition(pinPosRef.current));

        setPinning(!pinning);
    }, [dispatch, pinning]);

    const changePinPos = useCallback((pos) => {
        setPinPos(pos);
        pinPosRef.current = pos;
    }, []);

    const handlePosChange = useCallback(({ x, y }) => {
        calculatePosition(rbEle.current, { x, y }, changePinPos);
    }, [changePinPos]);

    const handleGetResultObjFromHistory = useCallback((text, { source, from, to }) => tsHistoryState.find((v) => (
        v.text === text &&
        v.translation.source === source &&
        v.translation.from === from &&
        v.translation.to === to
    )), [tsHistoryState]);

    const handleTranslate = useCallback((text, translation) => {
        // check if result is already in the history before send translate
        const tempResultObj = handleGetResultObjFromHistory(text, translation);
        if (tempResultObj) {
            dispatch(finishRequest(tempResultObj));
            return;
        }

        dispatch(startRequest());

        sendTranslate(text, translation, (result) => {
            if (result.suc) {
                dispatch(addHistory({...result.data, translation}));
                dispatch(finishRequest(result.data));
            }
            else dispatch(errorRequest(result.data.code));

            handlePosChange(pinPosRef.current);
        });
    }, [dispatch, handlePosChange, handleGetResultObjFromHistory]);

    const handleSourceChange = useCallback((source) => {
        if (source !== translationState.source) {
            const newTranslation = { source, from: '', to: '' };
            dispatch(translationUpdate(source, '', ''));
            resultObj.text && handleTranslate(resultObj.text, newTranslation);
        }
    }, [dispatch, translationState.source, resultObj.text, handleTranslate]);

    const handleReadText = useCallback((text, { source, from }) => {
        text && sendAudio(text, { source, from });
    }, []);

    const handleRawTextTranslate = useCallback((text) => {
        text && dispatch(requestTsResultWithText(text));
    }, [dispatch]);

    const handleSelectionChange = useCallback((from, to) => {
        dispatch(translationSetFromAndTo(from, to));
        if (resultObj.text) {
            const tempTranslation = { ...translationState, from, to };
            handleTranslate(resultObj.text, tempTranslation);
        }
    }, [resultObj.text, translationState, handleTranslate, dispatch]);

    useEffect(() => {
        !pinning && handlePosChange(pos);
    }, [pos, pinning, handlePosChange]);

    useEffect(() => {
        !requestEnd && !requesting && !withResultObj && text && handleTranslate(text, translationState);
    }, [requestEnd, requesting, withResultObj, text, translationState, handleTranslate,]);

    return (
        <div
            ref={rbEle}
            className='ts-rb'
            style={{
                display: show || pinning? 'block': 'none',
                transform: `translate(${pinPos.x}px, ${pinPos.y}px)`
            }}
            onMouseUp={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
        >
            <div
                className='ts-rb-head'
                onMouseDown={(e) => drag(e, pinPos, changePinPos, handlePosChange)}
            >
                <div className='tsrbh-title'>{getI18nMessage('contentResult')}</div>
                <span 
                    className='tsrbh-icons'
                >
                    <IconFont
                        iconName='#icon-GoChevronDown'
                        className={`${showRtAndLs? 'tsrbhr-rtandls-check': ''}`}
                        style={{visibility: withResultObj? 'hidden': 'visible'}}
                        onClick={() => {
                            if (withResultObj) return;
                            setShowRtAndLs(!showRtAndLs);
                        }}
                    />
                    <IconFont
                        iconName='#icon-GoPin'
                        onClick={pinningToggle}
                        className={`${pinning? 'tsrbhr-pin-check': ''}`}
                    />
                </span>
            </div>
            <div className='ts-rb-content'>
                <div className={`tsrbc-rtandls ${showRtAndLs && !withResultObj? 'tsrbc-rtandls-show': ''}`}>
                    <RawText
                        defaultValue={text}
                        rawTextTranslate={handleRawTextTranslate}
                    />
                    <LanguageSelection
                        selectionChange={handleSelectionChange}
                        from={translationState.from}
                        to={translationState.to}
                        options={langCode[translationState.source]}
                        disableSelect={withResultObj}
                    />
                </div>
                <TsResult
                    resultObj={resultObj}
                    status={{requestEnd, requesting, err, errCode}}
                    sourceChange={handleSourceChange}
                    readText={handleReadText}
                    source={withResultObj? resultObj.translation.source: translationState.source}
                    disableSourceChange={withResultObj}
                />
            </div>
        </div>
    );
};

export default ResultBox;