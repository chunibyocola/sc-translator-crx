import React, {useState, useRef} from 'react';
import {useSelector} from 'react-redux';
import TsHistoryItem from './TsHistoryItem';
import IconFont from '../IconFont';
import {useIsEnable} from '../../public/react-use';
import {getI18nMessage} from '../../public/chrome-call';
import './style.css';

const TsHistory = () => {
    const [pinning, setPinning] = useState(false);
    const [fold, setFold] = useState(true);

    const historyEle = useRef(null);

    const tsHistoryState = useSelector(state => state.tsHistoryState);

    const isEnableHistory = useIsEnable('history', window.location.host);
    const isEnableTranslate = useIsEnable('translate', window.location.host);

    let foldTimeDelay;

    return (
        <div
            className={`ts-history ${fold? '': 'ts-history-show'}`}
            style={{display: isEnableHistory && isEnableTranslate? 'block': 'none'}}
            ref={historyEle}
            onMouseEnter={() => {
                if (pinning) return;
                if (foldTimeDelay) clearTimeout(foldTimeDelay);
                setFold(false);
            }}
            onMouseLeave={() => {
                foldTimeDelay = setTimeout(() => {
                    if (!pinning) {
                        setFold(true);
                    }
                }, 500);
            }}
        >
            <div
                className={`tsh-unfold`}
            >
                <IconFont iconName='#icon-GoChevronRight' />
                <span className='tsh-unfold-text'>ScTranslator</span>
            </div>
            <div className='ts-history-head'>
                {getI18nMessage('contentHistoryTitle')}
                <div
                    className={`tshh-icons ${pinning? 'tshh-icons-check': ''}`}
                    onClick={() => setPinning(!pinning)}
                    onMouseUp={e => e.stopPropagation()}
                    onMouseDown={e => e.stopPropagation()}
                >
                    <IconFont iconName='#icon-GoPin' />
                </div>
            </div>
            <div className='ts-history-content'>
                {
                    tsHistoryState.length === 0?
                        (<div className='ts-history-norecord'>
                            {getI18nMessage('contentNoRecord')}
                        </div>):
                        tsHistoryState.map(
                            (v, i) => (
                                <TsHistoryItem result={v} index={i} key={i} />
                            )
                        )
                }
            </div>
        </div>
    );
};

export default TsHistory;