import React, { useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconFont from '../IconFont';
import { useIsEnable } from '../../public/react-use';
import './style.css';
import { getMessage } from '../../public/i18n';
import HistoryResultPanel from './HistoryResultPanel';
import HistoryItem from './HistoryItem';
import { removeHistory } from '../../redux/actions/translateHistoryActions';

const TsHistory = () => {
    const [pinning, setPinning] = useState(false);
    const [fold, setFold] = useState(true);
    const [panelTranslations, setPanelTranslations] = useState([]);
    const [panelPosition, setPanelPosition] = useState({ x: 195, y: 5 });
    const [hovering, setHovering] = useState(false);

    const historyEle = useRef(null);

    const translateHistoryState = useSelector(state => state.translateHistoryState);

    const isEnableHistory = useIsEnable('history', window.location.host);
    const isEnableTranslate = useIsEnable('translate', window.location.host);

    const foldTimeDelay = useRef(null);

    const dispatch = useDispatch();

    const handleShowResultPanel = useCallback((translations, y) => {
        setPanelPosition({ x: 195, y });
        setPanelTranslations(translations);
    }, []);

    const handleRemoveHistory = useCallback((translateId) => {
        dispatch(removeHistory({ translateId }));
    }, [dispatch]);

    return (
        <div
            className={`ts-history ${fold ? '' : 'ts-history-show'}`}
            style={{display: isEnableHistory && isEnableTranslate ? 'block' : 'none'}}
            ref={historyEle}
            onMouseEnter={() => {
                setHovering(true);

                if (pinning) return;
                if (foldTimeDelay.current) clearTimeout(foldTimeDelay.current);
                setFold(false);
            }}
            onMouseLeave={() => {
                setHovering(false);
                setPanelTranslations([]);

                foldTimeDelay.current = setTimeout(() => {
                    if (!pinning) {
                        setFold(true);
                    }
                }, 500);
            }}
            onMouseUp={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
        >
            <div
                className='ts-history-unfold'
            >
                <IconFont iconName='#icon-GoChevronRight' />
                <span className='ts-history-unfold-text'>Sc</span>
            </div>
            <div className='ts-history-head'>
                {getMessage('contentHistoryTitle')}
                <div
                    className={`ts-history-head-icons ${pinning ? 'ts-history-head-icons-check' : ''}`}
                    onClick={() => setPinning(!pinning)}
                    onMouseUp={e => e.stopPropagation()}
                    onMouseDown={e => e.stopPropagation()}
                >
                    <IconFont iconName='#icon-GoPin' />
                </div>
            </div>
            <div className='ts-history-content ts-scrollbar'>
                {translateHistoryState.length === 0 ?
                    (<div className='ts-history-norecord'>
                        {getMessage('contentNoRecord')}
                    </div>) :
                translateHistoryState.map((v) => (
                    <HistoryItem historyItem={v} key={v.translateId} showResultPanel={handleShowResultPanel} removeHistory={handleRemoveHistory} />
                ))}
                <HistoryResultPanel translations={panelTranslations} position={panelPosition} show={panelTranslations?.length > 0 && hovering} />
            </div>
        </div>
    );
};

export default TsHistory;