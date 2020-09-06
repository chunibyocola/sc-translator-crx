import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setResultBoxShowAndPosition } from '../../redux/actions/resultBoxActions';
import { sendTranslate, sendAudio } from '../../public/send';
import TsResult from '../TsResult';
import LanguageSelection from '../LanguageSelection';
import RawText from '../RawText';
import { getI18nMessage } from '../../public/chrome-call';
import IconFont from '../IconFont';
import './style.css';
import { langCode } from '../../constants/langCode';
import { drag, calculatePosition } from '../../public/utils';
import {
    stRequestStart,
    stAddHistory,
    stSetSource,
    stSetFromAndTo,
    stSetText,
    stRequestFinish,
    stRequestError
} from '../../redux/actions/singleTranslateActions';

const initPos = { x: 0, y: 0 };

const ResultBox = () => {
    const { text, source, from, to, status, result, history, resultFromHistory } = useSelector(state => state.singleTranslateState);
    const { requesting, requestEnd } = status;

    const { show, pos } = useSelector(state => state.resultBoxState);
    
    const [pinning, setPinning] = useState(false);
    const [pinPos, setPinPos] = useState(initPos);
    const [showRtAndLs, setShowRtAndLs] = useState(false); 

    const pinPosRef = useRef(initPos);
    const rbEle = useRef(null);

    const dispatch = useDispatch();

    // position start
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

    useEffect(() => {
        !pinning && handlePosChange(pos);
    }, [pos, pinning, handlePosChange]);
    // position end

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

        sendTranslate(text, { source, from, to }, (result) => {
            if (result.suc) {
                dispatch(stAddHistory({ result: { ...result.data, translation: { source, from, to } } }));
                dispatch(stRequestFinish({ result: result.data }));
            }
            else dispatch(stRequestError({ errorCode: result.data.code }));

            handlePosChange(pinPosRef.current);
        });

    }, [dispatch, text, source, from, to, handleGetHistory, handlePosChange]);

    const handleSourceChange = useCallback((source) => {
        dispatch(stSetSource({ source }));
    }, [dispatch]);

    const handleSelectionChange = useCallback((from, to) => {
        dispatch(stSetFromAndTo({ from, to }));
    }, [dispatch]);

    const handleRawTextChange = useCallback((text) => {
        text && dispatch(stSetText({ text }));
    }, [dispatch]);

    const handleReadText = useCallback((text, { source, from }) => {
        text && sendAudio(text, { source, from });
    }, []);

    useEffect(() => {
        !requestEnd && !requesting && !resultFromHistory && text && handleTranslate();
    }, [requestEnd, requesting, resultFromHistory, text, handleTranslate]);

    return (
        <div
            ref={rbEle}
            className='ts-rb'
            style={{
                display: show || pinning ? 'block' : 'none',
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
                        className={`${showRtAndLs ? 'tsrbhr-rtandls-check' : ''}`}
                        style={{visibility: resultFromHistory ? 'hidden' : 'visible'}}
                        onClick={() => {
                            if (resultFromHistory) return;
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
                <div className={`tsrbc-rtandls ${showRtAndLs && !resultFromHistory ? 'tsrbc-rtandls-show' : ''}`}>
                    <RawText
                        defaultValue={text}
                        rawTextTranslate={handleRawTextChange}
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
                    sourceChange={handleSourceChange}
                    readText={handleReadText}
                    source={resultFromHistory ? result.translation.source : source}
                    disableSourceChange={resultFromHistory}
                />
            </div>
        </div>
    );
};

export default ResultBox;