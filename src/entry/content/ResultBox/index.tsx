import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import CollectButton from '../../../components/CollectButton';
import DisplayEditAreaButton from '../../../components/DisplayEditAreaButton';
import IconFont from '../../../components/IconFont';
import { setLocalStorage } from '../../../public/chrome-call';
import { useAppDispatch, useAppSelector, useOptions, useWindowSize } from '../../../public/react-use';
import { calculatePosition, drag } from '../../../public/utils';
import { closePanel, setPanelPinning } from '../../../redux/slice/panelStatusSlice';
import { DefaultOptions, Position } from '../../../types';
import MultipleTranslateResult from '../MultipleTranslateResult';
import SingleTranslateResult from '../SingleTranslateResult';
import './style.css';

const initPos = { x: 5, y: 5 };

type PickedOptions = Pick<
    DefaultOptions,
    'rememberPositionOfPinnedPanel' |
    'positionOfPinnedPanel' |
    'translatePanelMaxHeight' |
    'translatePanelWidth' |
    'autoTranslateAfterInput'
>;
const useOptionsDependency: (keyof PickedOptions)[] = [
    'rememberPositionOfPinnedPanel',
    'positionOfPinnedPanel',
    'translatePanelMaxHeight',
    'translatePanelWidth',
    'autoTranslateAfterInput'
];

type ResultBoxProps = {
    multipleTranslateMode: boolean;
};

const ResultBox: React.FC<ResultBoxProps> = ({ multipleTranslateMode }) => {
    const [pinPos, setPinPos] = useState(initPos);
    const [maxHeightGap, setMaxHeightGap] = useState(600);

    const pinPosRef = useRef(initPos);
    const mtEle = useRef<HTMLDivElement>(null);
    const oldPos = useRef<Position>();

    const { show, position, pinning, displayEditArea } = useAppSelector(state => state.panelStatus);

    const dispatch = useAppDispatch();

    const {
        rememberPositionOfPinnedPanel,
        positionOfPinnedPanel,
        translatePanelMaxHeight,
        translatePanelWidth,
        autoTranslateAfterInput
    } = useOptions<PickedOptions>(useOptionsDependency);

    const windowSize = useWindowSize();

    const handleSetPinning = useCallback((pinning: boolean) => {
        dispatch(setPanelPinning({ pinning }));
    }, [dispatch]);

    useEffect(() => {
        if (rememberPositionOfPinnedPanel && pinning && mtEle.current) {
            pinPosRef.current = { ...positionOfPinnedPanel };
            calculatePosition(mtEle.current, pinPosRef.current, setPinPos);
        }
    }, [rememberPositionOfPinnedPanel, pinning, positionOfPinnedPanel]);

    useEffect(() => {
        mtEle.current && calculatePosition(mtEle.current, pinPosRef.current, setPinPos);
    }, [windowSize]);

    useLayoutEffect(() => {
        if (!mtEle.current) { return; }

        const maxHeight = translatePanelMaxHeight.percentage ? ~~(windowSize.height * translatePanelMaxHeight.percent / 100) : translatePanelMaxHeight.px;
        setMaxHeightGap(maxHeight - mtEle.current.offsetHeight);
    }, [windowSize, translatePanelMaxHeight, displayEditArea]);

    // position start
    const changePinPos = useCallback((pos) => {
        setPinPos(pos);
        pinPosRef.current = pos;
    }, []);

    const handleMouseUpCallback = useCallback((pos: Position) => {
        if (!mtEle.current) { return; }

        calculatePosition(mtEle.current, pos, (pos) => {
            if (rememberPositionOfPinnedPanel && pinning && pinPos.x !== pos.x && pinPos.y !== pos.y) {
                setLocalStorage({ 'positionOfPinnedPanel': pos });
            }

            changePinPos(pos);
        });
    }, [rememberPositionOfPinnedPanel, changePinPos, pinPos, pinning]);

    useLayoutEffect(() => {
        if (oldPos.current === position || !mtEle.current) { return; }

        !pinning && calculatePosition(mtEle.current, position, changePinPos);

        oldPos.current = position;
    }, [position, pinning, changePinPos]);
    // position end

    const handleCloseIconClick = useCallback(() => {
        dispatch(closePanel());
    }, [dispatch]);

    return (
        <div
            ref={mtEle}
            className='panel'
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
                className='panel__header flex-justify-content-space-between'
                onMouseDown={e => drag(e.nativeEvent, pinPos, changePinPos, handleMouseUpCallback)}
            >
                <span className='panel__header-logo flex-align-items-center'>Sc</span>
                <span className='panel__header-icons flex-align-items-center'>
                    <CollectButton />
                    <DisplayEditAreaButton />
                    <IconFont
                        iconName='#icon-GoPin'
                        onClick={() => handleSetPinning(!pinning)}
                        style={pinning ? {transform: 'rotate(-45deg)', opacity: '1'} : {opacity: '0.6'}}
                        className='button'
                    />
                    <IconFont
                        className='iconbutton button'
                        iconName='#icon-GoX'
                        onClick={handleCloseIconClick}
                    />
                </span>
            </div>
            <div className='panel__content'>
                {multipleTranslateMode ? <MultipleTranslateResult
                    maxHeightGap={maxHeightGap}
                    autoTranslateAfterInput={autoTranslateAfterInput}
                /> : <SingleTranslateResult
                    maxHeightGap={maxHeightGap}
                    autoTranslateAfterInput={autoTranslateAfterInput}
                />}
            </div>
        </div>
    );
};

export default ResultBox;