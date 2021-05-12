import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconFont from '../../../components/IconFont';
import { setLocalStorage } from '../../../public/chrome-call';
import { useOptions, useWindowSize } from '../../../public/react-use';
import { calculatePosition, drag } from '../../../public/utils';
import { closeResultBox, setPanelPinning } from '../../../redux/actions/resultBoxActions';
import MultipleTranslateResult from '../MultipleTranslateResult';
import SingleTranslateResult from '../SingleTranslateResult';
import './style.css';

const initPos = { x: 5, y: 5 };
const useOptionsDependency = [
    'pinThePanelWhileOpeningIt',
    'rememberPositionOfPinnedPanel',
    'positionOfPinnedPanel',
    'translatePanelMaxHeight',
    'translatePanelWidth',
    'autoTranslateAfterInput'
];

const ResultBox = ({ multipleTranslateMode }) => {
    const [pinPos, setPinPos] = useState(initPos);
    const [showRtAndLs, setShowRtAndLs] = useState(false);
    const [maxHeightGap, setMaxHeightGap] = useState(600);

    const pinPosRef = useRef(initPos);
    const mtEle = useRef(null);
    const oldPos = useRef(null);
    const oldShow = useRef(null);

    const { show, pos, focusRawText, pinning } = useSelector(state => state.resultBoxState);

    const dispatch = useDispatch();

    const {
        pinThePanelWhileOpeningIt,
        rememberPositionOfPinnedPanel,
        positionOfPinnedPanel,
        translatePanelMaxHeight,
        translatePanelWidth,
        autoTranslateAfterInput
    } = useOptions(useOptionsDependency);

    const windowSize = useWindowSize();

    const handleSetPinning = useCallback((pinning) => {
        dispatch(setPanelPinning(pinning));
    }, [dispatch]);

    useEffect(() => {
        if (rememberPositionOfPinnedPanel && pinning) {
            pinPosRef.current = { ...positionOfPinnedPanel };
            calculatePosition(mtEle.current, pinPosRef.current, setPinPos);
        }
    }, [rememberPositionOfPinnedPanel, pinning, positionOfPinnedPanel]);

    useEffect(() => {
        mtEle && calculatePosition(mtEle.current, pinPosRef.current, setPinPos);
    }, [windowSize]);

    useLayoutEffect(() => {
        const maxHeight = translatePanelMaxHeight.percentage ? ~~(windowSize.height * translatePanelMaxHeight.percent / 100) : translatePanelMaxHeight.px;
        setMaxHeightGap(maxHeight - mtEle.current.offsetHeight);
    }, [windowSize, translatePanelMaxHeight, showRtAndLs]);

    useEffect(() => {
        if (oldShow.current === show) { return; }

        show && pinThePanelWhileOpeningIt && handleSetPinning(true);

        oldShow.current = show;
    }, [show, pinThePanelWhileOpeningIt, handleSetPinning]);

    // show 'RawText' and 'LanguageSelection' when "call out"'s keyboard shortcut pressed
    useEffect(() => {
        focusRawText && setShowRtAndLs(true);
    }, [focusRawText]);

    // position start
    const changePinPos = useCallback((pos) => {
        setPinPos(pos);
        pinPosRef.current = pos;
    }, []);

    const handleMouseUpCallback = useCallback((pos) => {
        calculatePosition(mtEle.current, pos, (pos) => {
            if (rememberPositionOfPinnedPanel && pinning && pinPos.x !== pos.x && pinPos.y !== pos.y) {
                setLocalStorage({ 'positionOfPinnedPanel': pos });
            }

            changePinPos(pos);
        });
    }, [rememberPositionOfPinnedPanel, changePinPos, pinPos, pinning]);

    useEffect(() => {
        if (oldPos.current === pos) { return; }

        !pinning && calculatePosition(mtEle.current, pos, changePinPos);

        oldPos.current = pos;
    }, [pos, pinning, changePinPos]);
    // position end

    const handleCloseIconClick = useCallback(() => {
        dispatch(closeResultBox());
    }, [dispatch]);

    return (
        <div
            ref={mtEle}
            className='ts-rb'
            style={{
                display: show ? 'block' : 'none',
                left: `${pinPos.x}px`,
                top: `${pinPos.y}px`,
                width: translatePanelWidth.percentage ? `calc(${translatePanelWidth.percent}% - 10px)` : `${translatePanelWidth.px}px`
            }}
            onMouseUp={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
        >
            <div
                className='ts-rb-header flex-justify-content-space-between'
                onMouseDown={e => drag(e, pinPos, changePinPos, handleMouseUpCallback)}
            >
                <span className='ts-rb-header-title flex-align-items-center'>Sc</span>
                <span className='ts-rb-header-icons flex-align-items-center'>
                    <IconFont
                        iconName='#icon-GoChevronDown'
                        onClick={() => setShowRtAndLs(!showRtAndLs)}
                        style={showRtAndLs ? {transform: 'rotate(180deg)', opacity: '1'} : {}}
                        className='ts-button'
                    />
                    <IconFont
                        iconName='#icon-GoPin'
                        onClick={() => handleSetPinning(!pinning)}
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
                {multipleTranslateMode ? <MultipleTranslateResult
                    showRtAndLs={showRtAndLs}
                    maxHeightGap={maxHeightGap}
                    autoTranslateAfterInput={autoTranslateAfterInput}
                /> : <SingleTranslateResult
                    showRtAndLs={showRtAndLs}
                    maxHeightGap={maxHeightGap}
                    autoTranslateAfterInput={autoTranslateAfterInput}
                />}
            </div>
        </div>
    );
};

export default ResultBox;