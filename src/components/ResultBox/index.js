import React, {useState, useEffect, useCallback, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    startRequest,
    showTsResult,
    finishRequest,
    showTsResultWithText,
    errorRequest,
    setTsResultPosition
} from '../../redux/actions/tsResultActions';
import {addHistory} from '../../redux/actions/tsHistoryActions';
import { translationUpdate } from '../../redux/actions/translationActions';
import {sendTranslate, sendAudio} from '../../public/send';
import TsResult from '../TsResult';
import LanguageSelection from '../LanguageSelection';
import RawText from '../RawText';
import {getI18nMessage} from '../../public/chrome-call';
import IconFont from '../IconFont';
import './style.css';

const resultBoxMargin = 5;
const initPos = { x: 0, y: 0 };

const drag = (element, currentPosition, mouseMoveCallback, mouseUpCallback) => {
    const originX = element.clientX;
    const originY = element.clientY;
    const tempX = currentPosition.x;
    const tempY = currentPosition.y;
    let newX = tempX;
    let newY = tempY;
    document.onselectstart = () => { return false; };
    document.onmousemove = function (ev) {
        const nowX = ev.clientX;
        const nowY = ev.clientY;
        const diffX = originX - nowX;
        const diffY = originY - nowY;
        newX = tempX - diffX;
        newY = tempY - diffY;
        mouseMoveCallback({x: newX, y: newY});
    };
    document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
        document.onselectstart = () => { return true; };
        mouseUpCallback({x: newX, y: newY});
    };
};

const ResultBox = () => {
    const {
        requestEnd,
        requesting,
        err,
        errCode,
        show,
        pos,
        resultObj,
        withResultObj,
        text
    } = useSelector(state => state.tsResultState);
    const tsHistoryState = useSelector(state => state.tsHistoryState);
    const translationState = useSelector(state => state.translationState);
    
    const [pinning, setPinning] = useState(false);
    const [pinPos, setPinPos] = useState(initPos);
    const [showRtAndLs, setShowRtAndLs] = useState(false); 

    const pinPosRef = useRef(initPos);
    const rbEle = useRef(null);

    const dispatch = useDispatch();

    const pinningToggle = useCallback(
        () => {
            if (pinning) {
                dispatch(setTsResultPosition(pinPosRef.current));
                dispatch(showTsResult());
            }

            setPinning(!pinning);
        },
        [dispatch, pinning]
    );

    const changePinPos = useCallback(
        (pos) => {
            setPinPos(pos);
            pinPosRef.current = pos;
        },
        []
    );

    const handlePosChange = useCallback(
        ({x, y}) => {
            const dH = document.documentElement.clientHeight;
            const dW = document.documentElement.clientWidth;
            const rbW = rbEle.current.clientWidth;
            const rbH = rbEle.current.clientHeight;
            const rbL = x;
            const rbT = y;
            const rbB = rbT + rbH;
            const rbR = rbL + rbW;
            // show top and right prior
            if (rbL < resultBoxMargin) x = resultBoxMargin;
            if (rbR > dW) x = dW - resultBoxMargin - rbW;
            if (rbB > dH) y = dH - resultBoxMargin - rbH;
            if (y < resultBoxMargin) y = resultBoxMargin;
            changePinPos({x, y});
        },
        [changePinPos]
    );

    const handleTranslate = useCallback(
        (text, translation) => {
            dispatch(startRequest());

            sendTranslate(text, translation, (result) => {
                if (result.suc) {
                    dispatch(addHistory({...result.data, translation}));
                    dispatch(finishRequest(result.data));
                }
                else dispatch(errorRequest(result.data.code));

                handlePosChange(pinPosRef.current);
            });
        },
        [dispatch, handlePosChange]
    );

    const handleGetResultObjFromHistory = useCallback(
        (text, {source, from, to}) => tsHistoryState.find((v) => (
            v.text === text &&
            v.translation.source === source &&
            v.translation.from === from &&
            v.translation.to === to
        )),
        [tsHistoryState]
    );

    const handleSourceChange = useCallback(
        (source) => {
            if (source !== translationState.source) {
                const newTranslation = { source, from: '', to: '' };
                dispatch(translationUpdate(source, '', ''));
                if (resultObj.text) {
                    const tempResultObj = handleGetResultObjFromHistory(resultObj.text, newTranslation);
                    if (tempResultObj) {
                        dispatch(finishRequest(tempResultObj));
                        return;
                    }
                    handleTranslate(resultObj.text, newTranslation);
                }
            }
        },
        [dispatch, translationState.source, resultObj.text, handleTranslate, handleGetResultObjFromHistory]
    );

    const handleReadText = useCallback(
        (text, {source, from}) => {
            if (text) sendAudio(text, {source, from});
        },
        []
    );

    const handleRawTextTranslate = useCallback(
        (text) => {
            if (text) dispatch(showTsResultWithText(text));
        },
        [dispatch]
    );

    const handleSelectionChange = useCallback(
        (from, to) => {
            if (resultObj.text) {
                const tempTranslation = {...translationState, from, to};
                const tempResultObj = handleGetResultObjFromHistory(resultObj.text, tempTranslation);
                if (tempResultObj) {
                    dispatch(finishRequest(tempResultObj));
                    return;
                }
                handleTranslate(resultObj.text, tempTranslation);
            }
        },
        [resultObj.text, translationState, handleTranslate, dispatch, handleGetResultObjFromHistory]
    );

    useEffect(
        () => {
            !pinning && changePinPos(pos);
        },
        [pos, pinning, changePinPos]
    );

    useEffect(
        () => {
            if (!requestEnd && !requesting && !withResultObj && text) {
                const tempResultObj = handleGetResultObjFromHistory(text, translationState);
                if (tempResultObj) {
                    dispatch(finishRequest(tempResultObj));
                    return;
                }
                handleTranslate(text, translationState);
            }
        },
        [
            requestEnd,
            requesting,
            withResultObj,
            text,
            dispatch,
            translationState,
            handleTranslate,
            handleGetResultObjFromHistory
        ]
    );

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