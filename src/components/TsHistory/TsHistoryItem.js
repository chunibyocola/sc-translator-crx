import React, { useCallback, useRef } from 'react';
import { setResultBoxShowAndPosition } from '../../redux/actions/resultBoxActions';
import { resultToString } from '../../public/utils';
import { useDispatch } from 'react-redux';
import IconFont from '../IconFont';
import { sendAudio } from '../../public/send';
import { stRemoveHistory, stSetResultFromHistory } from '../../redux/actions/singleTranslateActions';

const TsHistoryItem = ({ result, index }) => {
    const itemEle = useRef(null);

    const dispatch = useDispatch();

    const handleReadText = useCallback((text, source, from) => {
        if (text) sendAudio(text, { source, from });
    }, []);

    const handleRemoveHistory = useCallback((index) => {
        dispatch(stRemoveHistory({ historyIndex: index }));
    }, [dispatch]);
    
    const handleItemClick = useCallback(() => {
        const ele = itemEle.current;

        dispatch(setResultBoxShowAndPosition({
            x: 205,
            y: ele.offsetTop - ele.parentNode.scrollTop
        }));
        dispatch(stSetResultFromHistory({ result }));
    }, [dispatch, result]);
    
    return (
        <div className='ts-history-item' ref={itemEle}>
            <div
                className='tshi-content'
                onClick={handleItemClick}
                onMouseUp={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
            >
                <div className='tshi-content-text'>
                    {result.text}
                </div>
                <div className='tshi-content-result'>
                    {resultToString(result.result)}
                </div>
            </div>
            <div className='tshi-icons'>
                <IconFont
                    iconName='#icon-GoUnmute'
                    onMouseUp={e => e.stopPropagation()}
                    onMouseDown={e => e.stopPropagation()}
                    onClick={() => handleReadText(result.text, result.translation.source, result.from)}
                />
                <IconFont
                    iconName='#icon-GoX'
                    onMouseUp={e => e.stopPropagation()}
                    onMouseDown={e => e.stopPropagation()}
                    onClick={() => handleRemoveHistory(index)}
                />
            </div>
        </div>
    );
};

export default TsHistoryItem;