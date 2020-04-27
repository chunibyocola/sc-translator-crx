import React, {useState, useEffect, useCallback, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    startRequest,
    showTsResult,
    finishRequest,
    showTsResultWithText,
    errorRequest
} from '../../redux/actions/tsResultActions';
import {addHistory} from '../../redux/actions/tsHistoryActions';
import {translationSetSource} from '../../redux/actions/translationActions';
import {setSelecting} from '../../public/utils/getSelection';
import {sendTranslate, sendAudio} from '../../public/send';
import TsResult from '../TsResult';
import LanguageSelection from '../LanguageSelection';
import RawText from '../RawText';
import {getContentText} from '../../public/localization';
import IconFont from '../IconFont';
import './style.css';

const resultBoxMargin = 5;

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
    
    const [initPos, setInitPos] = useState({x: 0, y: 0});
    const [pinning, setPinning] = useState(false);
    const [pinPos, setPinPos] = useState({x: 0, y: 0});
    const [showRtAndLs, setShowRtAndLs] = useState(false); 

    const rbEle = useRef(null);
    const pinPosRef = useRef({x: 0, y: 0});

    const dispatch = useDispatch();

    const goPinning = useCallback(
            (pos) => {
            if (!pinning) {
                setPinPos(pos);
                pinPosRef.current = pos;
            }
            else {
                setSelecting();
                dispatch(showTsResult());
            }
            setPinning(!pinning);
        },
        [dispatch, pinning]
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
            setPinPos({x, y});
            pinPosRef.current = {x, y};
        },
        []
    );

    const drag = useCallback(
        (e) => {
            const originX = e.clientX;
            const originY = e.clientY;
            const tempX = pinPosRef.current.x;
            const tempY = pinPosRef.current.y;
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
                setPinPos({x: newX, y: newY});
                pinPosRef.current = {x: newX, y: newY};
            };
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
                document.onselectstart = () => { return true; };
                handlePosChange({x: newX, y: newY});
            };
        },
        [handlePosChange]
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
                dispatch(translationSetSource(source));
                if (resultObj.text) {
                    const tempTranslation = {...translationState, source};
                    const tempResultObj = handleGetResultObjFromHistory(resultObj.text, tempTranslation);
                    if (tempResultObj) {
                        dispatch(finishRequest(tempResultObj));
                        return;
                    }
                    handleTranslate(resultObj.text, {...translationState, source});
                }
            }
        },
        [dispatch, translationState, resultObj.text, handleTranslate, handleGetResultObjFromHistory]
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
            if (!show && !pinning) setInitPos({x: 0, y: 0});
            if (show && (pos.x !== initPos.x || pos.y !== initPos.y)) {
                setInitPos(pos);
                if (!pinning) {
                    setPinPos(pos);
                    pinPosRef.current = pos;
                    handlePosChange(pos);
                }
            }
        },
        [pos, initPos.x, initPos.y, pinning, show, handlePosChange]
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
                onMouseDown={e => drag(e)}
            >
                <div className='tsrbh-title'>{getContentText('result')}</div>
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
                        onClick={() => goPinning(pinPos)}
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