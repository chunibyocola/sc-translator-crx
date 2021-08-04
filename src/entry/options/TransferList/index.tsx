import React, { useState, useEffect, useCallback } from 'react';
import { translateSource } from '../../../constants/translateSource';
import SourceFavicon from '../../../components/SourceFavicon';
import './style.css';
import { getMessage } from '../../../public/i18n';

type TransferListProps = {
    enabledList: string[];
    onChange: (enabledList: string[]) => void;
};

const TransferList: React.FC<TransferListProps> = ({ enabledList, onChange }) => {
    const [notEnabledList, setNotEnabledList] = useState<string[]>([]);
    const [leftChecked, setLeftChecked] = useState<string[]>([]);
    const [rightChecked, setRightChecked] = useState<string[]>([]);

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
            {getMessage('optionsSourceList')}
            <div className='transfer-content'>
                <div className='transfer-content__box'>
                    <div className='transfer-content__box-head'>{getMessage('optionsEnabled')}</div>
                    <hr />
                    <div className='transfer-content__box-list'>
                        {enabledList.map(v => (
                            <div
                                className='transfer-content__box-list-item'
                                key={v}
                                onClick={() => handleCheckToggle(v, true)}
                            >
                                <input type='checkbox' checked={leftChecked.indexOf(v) !== -1} />
                                <SourceFavicon source={v} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className='transfer-content__operation-panel'>
                    <button onClick={() => handleTransferAll(false)}>≫</button>
                    <button onClick={() => handleTransfer(false)} disabled={leftChecked.length === 0}>&gt;</button>
                    <button onClick={() => handleTransfer(true)} disabled={rightChecked.length === 0}>&lt;</button>
                    <button onClick={() => handleTransferAll(true)}>≪</button>
                </div>
                <div className='transfer-content__box'>
                    <div className='transfer-content__box-head'>{getMessage('optionsNotEnabled')}</div>
                    <hr />
                    <div className='transfer-content__box-list'>
                        {notEnabledList.map(v => (
                            <div
                                className='transfer-content__box-list-item'
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