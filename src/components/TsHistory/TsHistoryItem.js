import React, {useCallback, useRef} from 'react';
import {removeHistory} from '../../redux/actions/tsHistoryActions';
import {showTsResultWithResultObject} from '../../redux/actions/tsResultActions';
import {setSelecting} from '../../public/utils/getSelection';
import {useDispatch} from 'react-redux';
import IconFont from '../IconFont';
import {sendAudio} from '../../public/send';

const resultToStr = arr => arr.reduce((t, c) => (t + ' ' + c), '').slice(1);

const TsHistoryItem = ({result, index}) => {
    const itemEle = useRef(null);

    const dispatch = useDispatch();

    const handleReadText = useCallback(
        (text, source, from) => {
            if (text) sendAudio(text, {source, from});
        },
        []
    );

    const handleRemoveHistory = useCallback(
        (index) => {
            dispatch(removeHistory(index))
        },
        [dispatch]
    );
    
    const handleItemClick = useCallback(
        () => {
            const ele = itemEle.current;

            dispatch(showTsResultWithResultObject(result, {
                x: 205,
                y: ele.offsetTop - ele.parentNode.scrollTop
            }));

            setSelecting();
        },
        [dispatch, result]
    );
    
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
                    {resultToStr(result.result)}
                </div>
            </div>
            <div className='tshi-icons'>
                <IconFont
                    iconName='#icon-GoUnmute'
                    onMouseUp={e => e.stopPropagation()}
                    onMouseDown={e => e.stopPropagation()}
                    onClick={() => handleReadText(result.text, result.translation.source, result.translation.from)}
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