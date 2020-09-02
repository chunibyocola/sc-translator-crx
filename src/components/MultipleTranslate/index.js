import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { mtRequestStart, mtRequestFinish, mtRequestError, mtRemoveSource, mtSetText, mtSetFromAndTo } from '../../redux/actions/multipleTranslateActions';
import { setResultBoxShowAndPosition } from '../../redux/actions/resultBoxActions';
import MtResult from './MtResult';
import MtAddSource from './MtAddSource';
import IconFont from '../IconFont';
import LanguageSelection from '../LanguageSelection';
import RawText from '../RawText';
import { sendTranslate, sendAudio } from '../../public/send';
import { getI18nMessage } from '../../public/chrome-call';
import './style.css';
import { mtLangCode } from '../../constants/langCode';

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

const resultBoxMargin = 5;
const calculatePosition = (element, { x, y }, callback) => {
    const dH = document.documentElement.clientHeight;
    const dW = document.documentElement.clientWidth;
    const rbW = element.clientWidth;
    const rbH = element.clientHeight;
    const rbL = x;
    const rbT = y;
    const rbB = rbT + rbH;
    const rbR = rbL + rbW;
    // show top and right prior
    if (rbL < resultBoxMargin) x = resultBoxMargin;
    if (rbR > dW) x = dW - resultBoxMargin - rbW;
    if (rbB > dH) y = dH - resultBoxMargin - rbH;
    if (y < resultBoxMargin) y = resultBoxMargin;
    callback({ x, y });
};

const initPos = { x: 5, y: 5 };

const MultipleTranslate = () => {
    const [pinning, setPinning] = useState(false);
    const [pinPos, setPinPos] = useState(initPos);
    const [showRtAndLs, setShowRtAndLs] = useState(false);

    const pinPosRef = useRef(initPos);
    const mtEle = useRef(null);

    const { show, pos } = useSelector(state => state.resultBoxState);
    const { text, from, to, translations } = useSelector(state => state.multipleTranslateState);

    const dispatch = useDispatch();

    // position start
    const handlePosChange = useCallback(({x, y}) => {
        calculatePosition(mtEle.current, { x, y}, changePinPos);
    }, [changePinPos]);

    const pinningToggle = useCallback(() => {
        pinning && dispatch(setResultBoxShowAndPosition(pinPosRef.current));

        setPinning(!pinning);
    }, [dispatch, pinning]);

    const changePinPos = useCallback((pos) => {
        setPinPos(pos);
        pinPosRef.current = pos;
    }, []);

    useEffect(() => {
        !pinning && handlePosChange(pos);
    }, [pos, pinning, handlePosChange]);
    // position end

    const handleTranslate = useCallback((source) => {
        dispatch(mtRequestStart({ source }));
        //setTimeout(() => dispatch(mtRequestFinish({ source, result: { result: text }})), 500);
        sendTranslate(text, { source, from, to }, (result) => {
            result.suc ? dispatch(mtRequestFinish({ source, result: result.data})) : dispatch(mtRequestError({ source, errorCode: result.data.code }));
        });
    }, [text, from, to, dispatch]);

    const handleRemoveSource = useCallback((source) => {
        dispatch(mtRemoveSource({ source }));
    }, [dispatch]);

    const handleRawTextChange = useCallback((text) => {
        text && dispatch(mtSetText({ text }));
    }, [dispatch]);

    const handleSelectionChange = useCallback((from, to) => {
        dispatch(mtSetFromAndTo({ from, to }));
    }, [dispatch]);

    return (
        <div
            ref={mtEle}
            className='ts-mt'
            style={{display: show || pinning ? 'block' : 'none', transform: `translate(${pinPos.x}px, ${pinPos.y}px)`}}
            onMouseUp={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
        >
            <div
                className='ts-mt-header'
                onMouseDown={e => drag(e, pinPos, changePinPos, handlePosChange)}
            >
                <span className='ts-mt-header-title'>
                    <span>{getI18nMessage('contentResult')}</span>
                </span>
                <span className='ts-mt-header-icons'>
                    <IconFont
                        iconName='#icon-GoChevronDown'
                        onClick={() => setShowRtAndLs(!showRtAndLs)}
                        style={showRtAndLs ? {transform: 'rotate(180deg)', color: '#fff'} : {}}
                        className='ts-button'
                    />
                    <IconFont
                        iconName='#icon-GoPin'
                        onClick={pinningToggle}
                        style={pinning ? {transform: 'rotate(-45deg)', color: '#fff'} : {}}
                        className='ts-button'
                    />
                </span>
            </div>
            <div style={{display: showRtAndLs ? 'block' : 'none', width: '246px', margin: '0px auto'}}>
                <RawText defaultValue={text} rawTextTranslate={handleRawTextChange} />
                <LanguageSelection
                    selectionChange={handleSelectionChange}
                    from={from}
                    to={to}
                    options={mtLangCode}
                />
            </div>
            <div className='ts-mt-content'>
                {translations.length === 0 ? 
                    <div className='ts-mt-result-add-translate-source'>{getI18nMessage('sentenceAddTranslateSource')}</div> :
                translations.map(({ source, status, result }) => (
                    <MtResult
                        source={source}
                        status={status}
                        result={result}
                        key={source}
                        text={text}
                        translate={() => handleTranslate(source)}
                        remove={() => handleRemoveSource(source)}
                        readText={(text, from) => sendAudio(text, { source, from })}
                    />
                ))}
            </div>
            <MtAddSource translations={translations} />
        </div>
    );
};

export default MultipleTranslate;