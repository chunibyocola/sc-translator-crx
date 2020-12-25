import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconFont from '../../../components/IconFont';
import { calculatePosition, drag } from '../../../public/utils';
import { setResultBoxShowAndPosition } from '../../../redux/actions/resultBoxActions';
import MultipleTranslateResult from '../MultipleTranslateResult';
import SingleTranslateResult from '../SingleTranslateResult';
import './style.css';

const initPos = { x: 5, y: 5 };

const ResultBox = ({ multipleTranslateMode }) => {
    const [pinning, setPinning] = useState(false);
    const [pinPos, setPinPos] = useState(initPos);
    const [showRtAndLs, setShowRtAndLs] = useState(false);

    const pinPosRef = useRef(initPos);
    const mtEle = useRef(null);

    const { show, pos, focusRawText } = useSelector(state => state.resultBoxState);

    const dispatch = useDispatch();


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

    return (
        <div
            ref={mtEle}
            className='ts-rb'
            style={{display: show || pinning ? 'block' : 'none', transform: `translate(${pinPos.x}px, ${pinPos.y}px)`}}
            onMouseUp={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
        >
            <div
                className='ts-rb-header'
                onMouseDown={e => drag(e, pinPos, changePinPos, handlePosChange)}
            >
                <span className='ts-rb-header-title'>Sc</span>
                <span className='ts-rb-header-icons'>
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
            <div className='ts-rb-content'>
                {multipleTranslateMode ? <MultipleTranslateResult showRtAndLs={showRtAndLs} /> : <SingleTranslateResult showRtAndLs={showRtAndLs} />}
            </div>
        </div>
    );
};

export default ResultBox;