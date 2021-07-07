import React, { useCallback, useRef } from 'react';
import { TranslateHistoryItem } from '../../../redux/slice/translateHistorySlice';
import IconFont from '../../IconFont';
import './style.css';

type HistoryItemProps = {
    historyItem: TranslateHistoryItem;
    showResultPanel: (translations: any, top: number) => void;
    removeHistory: (translateId: number) => void;
};

const HistoryItem: React.FC<HistoryItemProps> = ({ historyItem, showResultPanel, removeHistory }) => {
    const { text, result, translations, translateId } = historyItem;

    const itemEle = useRef<HTMLDivElement>(null);

    const handleRemoveHistory = useCallback(() => {
        removeHistory(translateId);
    }, [removeHistory, translateId]);
    
    const handleItemClick = useCallback(() => {
        if (!itemEle.current) { return; 
}
        const { top } = itemEle.current.getBoundingClientRect();

        showResultPanel(translations, top);
    }, [showResultPanel, translations]);
    
    return (
        <div className='ts-history-item' ref={itemEle}>
            <div
                className='ts-history-item-content'
                onClick={handleItemClick}
            >
                <div className='ts-history-item-content-text'>
                    {text}
                </div>
                <div className='ts-history-item-content-result'>
                    {result}
                </div>
            </div>
            <div className='ts-history-item-icons'>
                <IconFont
                    className='ts-iconbutton ts-button'
                    iconName='#icon-GoX'
                    onClick={() => handleRemoveHistory()}
                />
            </div>
        </div>
    );
};

export default HistoryItem;