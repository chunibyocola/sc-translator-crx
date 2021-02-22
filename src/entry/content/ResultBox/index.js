import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconFont from '../../../components/IconFont';
import { useOptions } from '../../../public/react-use';
import { calculatePosition, drag } from '../../../public/utils';
import { closeResultBox, hideResultBox } from '../../../redux/actions/resultBoxActions';
import MultipleTranslateResult from '../MultipleTranslateResult';
import SingleTranslateResult from '../SingleTranslateResult';
import './style.css';

const initPos = { x: 5, y: 5 };
const useOptionsDependency = ['pinThePanelWhileOpeningIt'];

const ResultBox = ({ multipleTranslateMode }) => {
    const [pinning, setPinning] = useState(false);
    const [pinPos, setPinPos] = useState(initPos);
    const [showRtAndLs, setShowRtAndLs] = useState(false);

    const pinPosRef = useRef(initPos);
    const mtEle = useRef(null);
    const oldPos = useRef(null);
    const oldShow = useRef(null);
    const oldHidePanelRequest = useRef(null);

    const { show, pos, focusRawText, closePanel, hidePanelRequest } = useSelector(state => state.resultBoxState);

    const dispatch = useDispatch();

    const { pinThePanelWhileOpeningIt } = useOptions(useOptionsDependency);

    useEffect(() => {
        if (oldHidePanelRequest.current === hidePanelRequest) { return; }

        !pinning && dispatch(hideResultBox());

        oldHidePanelRequest.current = hidePanelRequest;
    }, [hidePanelRequest, pinning, dispatch]);

    useEffect(() => {
        if (oldShow.current === show) { return; }

        show && pinThePanelWhileOpeningIt && setPinning(true);

        oldShow.current = show;
    }, [show, pinThePanelWhileOpeningIt]);

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
        setPinning(!pinning);
    }, [pinning]);

    useEffect(() => {
        if (oldPos.current === pos) { return; }

        !pinning && handlePosChange(pos);

        oldPos.current = pos;
    }, [pos, pinning, handlePosChange]);
    // position end

    const handleCloseIconClick = useCallback(() => {
        dispatch(closeResultBox());
    }, [dispatch]);

    useEffect(() => {
        setPinning(false);
    }, [closePanel]);

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
                    <IconFont
                        className='ts-iconbutton ts-button'
                        iconName='#icon-GoX'
                        onClick={handleCloseIconClick}
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