import React, { useState, useRef, useCallback, useEffect } from 'react';
import IconFont from '../IconFont';
import { useAppDispatch, useAppSelector, useIsHistoryEnabled, useIsTranslateEnabled, useOptions } from '../../public/react-use';
import './style.css';
import { getMessage } from '../../public/i18n';
import HistoryResultPanel from './HistoryResultPanel';
import HistoryItem from './HistoryItem';
import { cn, mouseDrag } from '../../public/utils';
import { GetStorageKeys, Translation } from '../../types';
import { removeHistory } from '../../redux/slice/translateHistorySlice';
import Logo from '../Logo';
import scOptions from '../../public/sc-options';

const midInThree = (min: number, num: number, max: number) => (Math.min(max, Math.max(min, num)));

const useOptionsDependency: GetStorageKeys<'rememberHistoryPanelStatus' | 'historyPanelStatus'> = ['rememberHistoryPanelStatus', 'historyPanelStatus'];

const TsHistory: React.FC = () => {
    const [pinning, setPinning] = useState(false);
    const [fold, setFold] = useState(true);
    const [panelTranslations, setPanelTranslations] = useState<Translation[]>([]);
    const [panelTop, setPanelTop] = useState(5);
    const [historyWidth, setHistoryWidth] = useState(200);

    const translateHistoryState = useAppSelector(state => state.translateHistory);

    const { rememberHistoryPanelStatus, historyPanelStatus } = useOptions(useOptionsDependency);

    const historyEnabled = useIsHistoryEnabled(window.location.host);
    const translateEnabled = useIsTranslateEnabled(window.location.host);

    const foldTimeDelay = useRef<ReturnType<typeof setTimeout>>();

    const dispatch = useAppDispatch();

    const handleShowResultPanel = useCallback((translations: Translation[], y: number) => {
        setPanelTop(y);
        setPanelTranslations(translations);
    }, []);

    const handleRemoveHistory = useCallback((translateId: number) => {
        dispatch(removeHistory({ translateId }));
    }, [dispatch]);

    useEffect(() => {
        if (rememberHistoryPanelStatus) {
            setPinning(historyPanelStatus.pin);
            setHistoryWidth(historyPanelStatus.width);
            setFold(!historyPanelStatus.pin);
        }
    }, [rememberHistoryPanelStatus, historyPanelStatus]);

    return (
        <div
            className={cn('history', !fold && 'history--show')}
            style={{display: historyEnabled && translateEnabled ? 'block' : 'none', width: `${historyWidth}px`}}
            onMouseEnter={() => {
                if (pinning) { return; }

                foldTimeDelay.current && clearTimeout(foldTimeDelay.current);
                setFold(false);
            }}
            onMouseLeave={() => {
                setPanelTranslations([]);

                foldTimeDelay.current = setTimeout(() => !pinning && setFold(true), 500);
            }}
            onMouseUp={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
        >
            <div className='history__unfold'>
                <IconFont iconName='#icon-GoChevronRight' />
                <Logo style={{transform: 'rotate(-90deg)'}} />
            </div>
            <div className='history__head'>
                {getMessage('contentHistoryTitle')}
                <IconFont
                    iconName='#icon-GoPin'
                    className={`history-head__pin${pinning ? ' history-head__pin--ning' : ''}`}
                    onClick={() => {
                        const nextPinning = !pinning;
                        rememberHistoryPanelStatus && scOptions.set({ 'historyPanelStatus': { ...historyPanelStatus, pin: nextPinning } });
                        setPinning(nextPinning);
                        !nextPinning && setFold(true);
                    }}
                />
            </div>
            <div
                className='history__e-resize'
                onMouseDown={({ clientX }) => (mouseDrag(({ x }) => (
                    x !== clientX && setHistoryWidth(midInThree(100, x - 1 + historyWidth - clientX, 300))
                ), ({ x }) => {
                    if (x !== clientX) {
                        const nextWidth = midInThree(100, x - 1 + historyWidth - clientX, 300);
                        setHistoryWidth(nextWidth);
                        rememberHistoryPanelStatus && scOptions.set({ 'historyPanelStatus': { ...historyPanelStatus, width: nextWidth } });
                    }
                }))}
            ></div>
            <div className='history__content scrollbar'>
                {translateHistoryState.length === 0 ? <div className='history_no-record'>
                        {getMessage('contentNoRecord')}
                </div> : translateHistoryState.map((v) => (
                    <HistoryItem historyItem={v} key={v.translateId} showResultPanel={handleShowResultPanel} removeHistory={handleRemoveHistory} />
                ))}
                <HistoryResultPanel translations={panelTranslations} top={panelTop} historyWidth={historyWidth} />
            </div>
        </div>
    );
};

export default TsHistory;