import React, { useCallback, useRef } from 'react';
import IconFont from '../../IconFont';
import './style.css';

const HistoryItem = ({ historyItem, showResultPanel, removeHistory }) => {
    const { text, result, translations, translateId } = historyItem;

    const itemEle = useRef(null);

    const handleRemoveHistory = useCallback(() => {
        removeHistory(translateId);
    }, [removeHistory, translateId]);
    
    const handleItemClick = useCallback(() => {
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