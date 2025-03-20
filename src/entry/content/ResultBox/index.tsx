import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import CollectButton from '../../../components/PanelIconButtons/CollectButton';
import DisplayEditAreaButton from '../../../components/PanelIconButtons/DisplayEditAreaButton';
import { useAppSelector, useOptions, useWindowSize } from '../../../public/react-use';
import { calculatePosition, drag } from '../../../public/utils';
import { GetStorageKeys, Position } from '../../../types';
import MultipleTranslateResult from '../MultipleTranslateResult';
import './style.css';
import PinButton from '../../../components/PanelIconButtons/PinButton';
import CloseButton from '../../../components/PanelIconButtons/CloseButton';
import Logo from '../../../components/Logo';
import scOptions from '../../../public/sc-options';

const useOptionsDependency: GetStorageKeys<
    'rememberPositionOfPinnedPanel' |
    'positionOfPinnedPanel' |
    'translatePanelMaxHeight' |
    'translatePanelWidth'
> = [
    'rememberPositionOfPinnedPanel',
    'positionOfPinnedPanel',
    'translatePanelMaxHeight',
    'translatePanelWidth'
];

const ResultBox: React.FC = () => {
    const [panelPosition, setPanelPosition] = useState<Position>({ x: 5, y: 5 });
    const [maxHeightGap, setMaxHeightGap] = useState(600);

    const mtEle = useRef<HTMLDivElement>(null);
    const oldPositionRef = useRef<Position>();
    const lastStablePanelPositionRef = useRef<Position>({ x: 5, y: 5 });

    const { show, position, pinning, displayEditArea } = useAppSelector(state => state.panelStatus);

    const {
        rememberPositionOfPinnedPanel,
        positionOfPinnedPanel,
        translatePanelMaxHeight,
        translatePanelWidth,
    } = useOptions(useOptionsDependency);

    const windowSize = useWindowSize();

    useEffect(() => {
        if (rememberPositionOfPinnedPanel && pinning && mtEle.current) {
            setPanelPosition(calculatePosition(mtEle.current, positionOfPinnedPanel));

            lastStablePanelPositionRef.current = { ...positionOfPinnedPanel };
        }
    }, [rememberPositionOfPinnedPanel, pinning, positionOfPinnedPanel]);

    useEffect(() => {
        mtEle.current && setPanelPosition(calculatePosition(mtEle.current, lastStablePanelPositionRef.current));
    }, [windowSize]);

    useLayoutEffect(() => {
        if (!mtEle.current) { return; }

        const maxHeight = translatePanelMaxHeight.percentage ? ~~(windowSize.height * translatePanelMaxHeight.percent / 100) : translatePanelMaxHeight.px;
        setMaxHeightGap(maxHeight - mtEle.current.offsetHeight);
    }, [windowSize.height, translatePanelMaxHeight, displayEditArea]);

    const handleMouseUpCallback = useCallback((pos: Position) => {
        if (!mtEle.current) { return; }

        const nextPosition = calculatePosition(mtEle.current, pos);

        if (rememberPositionOfPinnedPanel && pinning && (panelPosition.x !== nextPosition.x || panelPosition.y !== nextPosition.y)) {
            scOptions.set({ positionOfPinnedPanel: nextPosition });
        }

        lastStablePanelPositionRef.current = nextPosition;
        setPanelPosition(nextPosition);
    }, [rememberPositionOfPinnedPanel, pinning, panelPosition]);

    useLayoutEffect(() => {
        if (oldPositionRef.current === position || !mtEle.current) { return; }

        if (!pinning) {
            const nextPanelPosition = calculatePosition(mtEle.current, position);

            setPanelPosition(nextPanelPosition);
            lastStablePanelPositionRef.current = nextPanelPosition;
        }

        oldPositionRef.current = position;
    }, [position, pinning]);

    return (
        <div
            ref={mtEle}
            className='panel'
            style={{
                display: show ? 'block' : 'none',
                left: `${panelPosition.x}px`,
                top: `${panelPosition.y}px`,
                width: translatePanelWidth.percentage ? `calc(${translatePanelWidth.percent}% - 10px)` : `${translatePanelWidth.px}px`
            }}
            onMouseUp={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
        >
            <div
                className='panel__header flex-justify-content-space-between'
                onMouseDown={e => drag(e.nativeEvent, panelPosition, setPanelPosition, handleMouseUpCallback)}
            >
                <span className='panel__header-logo flex-align-items-center'>
                    <Logo style={{pointerEvents: 'none'}} />
                </span>
                <span className='panel__header-icons flex-align-items-center'>
                    <CollectButton />
                    <DisplayEditAreaButton />
                    <PinButton />
                    <CloseButton />
                </span>
            </div>
            <div className='panel__content'>
                <MultipleTranslateResult
                    maxHeightGap={maxHeightGap}
                />
            </div>
        </div>
    );
};

export default ResultBox;