import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { mtRequestStart, mtRequestFinish, mtRequestError, mtRemoveSource, mtSetText, mtSetFromAndTo, mtRetry } from '../../redux/actions/multipleTranslateActions';
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
import { drag, calculatePosition } from '../../public/utils';

const initPos = { x: 5, y: 5 };

const MultipleTranslate = () => {
    const [pinning, setPinning] = useState(false);
    const [pinPos, setPinPos] = useState(initPos);
    const [showRtAndLs, setShowRtAndLs] = useState(false);

    const pinPosRef = useRef(initPos);
    const mtEle = useRef(null);
    const translateIdRef = useRef(0);

    const { show, pos, focusRawText } = useSelector(state => state.resultBoxState);
    const { text, from, to, translations, translateId } = useSelector(state => state.multipleTranslateState);

    const dispatch = useDispatch();

    translateIdRef.current = translateId;

    // show 'RawText' and 'LanguageSelection' when "call out"'s keyboard shortcut pressed
    useEffect(() => {
        focusRawText && setShowRtAndLs(true);
    }, [focusRawText]);

    // position start
    const changePinPos = useCallback((pos) => {
        setPinPos(pos);
        pinPosRef.current = pos;
    }, []);

    const handlePosChange = useCallback(({ x, y }) => {
        calculatePosition(mtEle.current, { x, y }, changePinPos);
    }, [changePinPos]);

    const pinningToggle = useCallback(() => {
        pinning && dispatch(setResultBoxShowAndPosition(pinPosRef.current));

        setPinning(!pinning);
    }, [dispatch, pinning]);

    useEffect(() => {
        !pinning && handlePosChange(pos);
    }, [pos, pinning, handlePosChange]);
    // position end

    const handleTranslate = useCallback((source) => {
        dispatch(mtRequestStart({ source }));

        sendTranslate(text, { source, from, to, translateId: translateIdRef.current }, (result) => {
            if (result.translateId !== translateIdRef.current) { return; }

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

    const handleRetry = useCallback((source) => {
        dispatch(mtRetry({ source }));
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
                    <span>Sc</span>
                </span>
                <span className='ts-mt-header-icons'>
                    <IconFont
                        iconName='#icon-GoChevronDown'
                        onClick={() => setShowRtAndLs(!showRtAndLs)}
                        style={showRtAndLs ? {transform: 'rotate(180deg)', opacity: '1'} : {}}
                        className='ts-button'
                    />
                    <IconFont
                        iconName='#icon-GoPin'
                        onClick={pinningToggle}
                        style={pinning ? {transform: 'rotate(-45deg)', opacity: '1'} : {}}
                        className='ts-button'
                    />
                </span>
            </div>
            <div className='ts-mt-content'>
                <div style={{display: showRtAndLs ? 'block' : 'none'}}>
                    <RawText
                        defaultValue={text}
                        rawTextTranslate={handleRawTextChange}
                        focusDependency={focusRawText}
                    />
                    <LanguageSelection
                        selectionChange={handleSelectionChange}
                        from={from}
                        to={to}
                        options={mtLangCode}
                    />
                </div>
                <div className='ts-mt-results ts-scrollbar'>
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
                            retry={() => handleRetry(source)}
                        />
                    ))}
                </div>
                <MtAddSource translations={translations} />
            </div>
        </div>
    );
};

export default MultipleTranslate;