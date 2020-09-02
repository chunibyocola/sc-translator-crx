import React, { useState, useEffect, useCallback } from 'react';
import { translateSource } from '../../constants/translateSource';
import SourceFavicon from '../SourceFavicon';
import { getI18nMessage } from '../../public/chrome-call';

const TransferList = ({ enabledList, onChange }) => {
    const [notEnabledList, setNotEnabledList] = useState([]);
    const [leftChecked, setLeftChecked] = useState([]);
    const [rightChecked, setRightChecked] = useState([]);

    useEffect(() => {
        setNotEnabledList(translateSource.filter(v => enabledList.indexOf(v.source) === -1).map(v => v.source));
    }, [enabledList]);

    const handleCheckToggle = useCallback((value, left) => {
        const index = left ? leftChecked.indexOf(value) : rightChecked.indexOf(value);
        let arr = left ? [...leftChecked] : [...rightChecked];
        index === -1 ? (arr = arr.concat(value)) : arr.splice(index, 1);
        left ? setLeftChecked(arr) : setRightChecked(arr);
    }, [leftChecked, rightChecked]);

    const handleTransfer = useCallback((left) => {
        if (left) {
            onChange(enabledList.concat(notEnabledList.filter(v => rightChecked.indexOf(v) !== -1)));
            setRightChecked([]);
        }
        else {
            onChange(enabledList.filter(v => leftChecked.indexOf(v) === -1));
            setLeftChecked([]);
        }
    }, [enabledList, notEnabledList, leftChecked, rightChecked, onChange]);

    const handleTransferAll = useCallback((left) => {
        if (left) {
            onChange(enabledList.concat(notEnabledList));
            setLeftChecked(leftChecked.concat(rightChecked));
            setRightChecked([]);
            setNotEnabledList([]);
        }
        else {
            onChange([]);
            setRightChecked(rightChecked.concat(leftChecked));
            setLeftChecked([]);
            setNotEnabledList(notEnabledList.concat(enabledList));
        }
    }, [enabledList, notEnabledList, leftChecked, rightChecked, onChange]);

    return (
        <div className='transfer-list'>
            {getI18nMessage('optionsSourceList')}
            <div className='transfer-content'>
                <div className='transfer-box'>
                    <div className='transfer-box-head'>{getI18nMessage('optionsEnabled')}</div>
                    <hr />
                    <div className='transfer-box-list'>
                        {enabledList.map(v => (
                            <div
                                className='transfer-box-list-item'
                                key={v}
                                onClick={() => handleCheckToggle(v, true)}
                            >
                                <input type='checkbox' checked={leftChecked.indexOf(v) !== -1} />
                                <SourceFavicon source={v} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className='operation-panel'>
                    <button onClick={() => handleTransferAll(false)}>≫</button>
                    <button onClick={() => handleTransfer(false)} disabled={leftChecked.length === 0}>&gt;</button>
                    <button onClick={() => handleTransfer(true)} disabled={rightChecked.length === 0}>&lt;</button>
                    <button onClick={() => handleTransferAll(true)}>≪</button>
                </div>
                <div className='transfer-box'>
                    <div className='transfer-box-head'>{getI18nMessage('optionsNotEnabled')}</div>
                    <hr />
                    <div className='transfer-box-list'>
                        {notEnabledList.map(v => (
                            <div
                                className='transfer-box-list-item'
                                key={v}
                                onClick={() => handleCheckToggle(v, false)}
                            >
                                <input type='checkbox' checked={rightChecked.indexOf(v) !== -1} />
                                <SourceFavicon source={v} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransferList;